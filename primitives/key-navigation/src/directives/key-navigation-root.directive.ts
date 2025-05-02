import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { FocusCallback, NavigationDirection, Rule } from '../models/keyboard-navigation.model';
import { KeyboardNavigationService } from '../state/keyboard-navigation.service';

@Directive({
  selector: '[vacKeyNavigationRoot]',
  standalone: true,
  providers: [KeyboardNavigationService],
  exportAs: 'vacKeyNavigationRoot',
  inputs: [
    'navigationRules',
    'direction',
    'loop',
    'disabled',
    'tabNavigation',
    'focusCallback',
    'rememberLastFocus',
    'mode',
    'highlightCallback'
  ],
})
export class KeyNavigationRootDirective {
  private state = inject(KeyboardNavigationService);
  private el = inject(ElementRef);

  set navigationRules(newRules: Rule[]) {
    this.state.customRules.set(newRules);
  }
  set direction(newDirection: NavigationDirection) {
    this.state.direction.set(newDirection);
  }
  set loop(loop: boolean) {
    this.state.loop = loop;
  }
  set disabled(disabled: boolean) {
    this.state.disabled.set(disabled);
  }
  set tabNavigation(tabNavigation: boolean) {
    this.state.tabNavigation = tabNavigation;
  }
  set focusCallback(callback: FocusCallback | null) {
    this.state.focusCallback = callback;
  }
  set rememberLastFocus(value: boolean) {
    this.state.rememberLastFocused = value;
  }
  set mode(mode: 'focus' | 'highlight') {
    this.state.mode.set(mode);
  }
  set highlightCallback(highlightCallback: FocusCallback | null) {
    this.state.highlightCallback = highlightCallback;
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    this.state.handleKeydown(event);
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: FocusEvent) {
    const focusTargetElement = event.relatedTarget as HTMLElement;
    // Focus has left the navigable area; reset the focusable state so when the user enters the area again, starts in the first or the selected item.
    if (!this.el.nativeElement.contains(focusTargetElement) && !this.state.rememberLastFocused) {
      this.state.resetFocus(true);
    }
  }
}
