import { Directive, ElementRef, HostListener, Renderer2, inject, input } from '@angular/core';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { Tab } from '../models/tabs.model';
import { TabsStateService } from '../state/tabs-state.service';

@Directive({
  selector: '[vacTabsList]',
  exportAs: 'vacTabsList',
  standalone: true,
  host: { role: 'tablist' }
})
export class TabsListDirective {
  state = inject(TabsStateService);
  loop = input(true);
  private elRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private focusedTab: Tab | null = null;

  constructor() {
    hostBinding('attr.data-orientation', this.state.orientation);
    hostBinding('attr.aria-orientation', this.state.orientation);
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const activeTabId = this.focusedTab?.id ?? this.state.value();
    if (!activeTabId) return;

    const tabs = this.state.getAllTabs();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    const isVertical = this.state.orientation() === 'vertical';

    let newIndex: number | undefined;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = this.findPreviousAvailableTab(tabs, currentIndex);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = this.findNextAvailableTab(tabs, currentIndex);
        break;
      case 'Home':
        newIndex = tabs.findIndex((tab) => !tab.disabled);
        break;
      case 'End':
        newIndex = tabs.length - 1;
        while (newIndex >= 0 && tabs[newIndex].disabled) {
          newIndex--;
        }
        break;
    }

    // Ensuring the newIndex is defined, within range, and points to an enabled tab
    if (newIndex !== undefined && newIndex >= 0 && newIndex < tabs.length) {
      event.preventDefault();
      const newTab = tabs[newIndex];
      this.focusedTab = newTab;

      const currentTabHTMLElement = this.state.selectedTab()?.elementRef.nativeElement;
      this.renderer.setAttribute(currentTabHTMLElement, 'tabindex', '-1');
      this.renderer.setAttribute(newTab.elementRef.nativeElement, 'tabindex', '0');
      newTab.elementRef.nativeElement.focus();

      if (this.state.automatic()) {
        this.state.value.set(newTab.id);
      }
    }
  }

  private findPreviousAvailableTab(tabs: Tab[], currentIndex: number): number | undefined {
    let newIndex = currentIndex;
    do {
      newIndex--;
      if (newIndex < 0) {
        if (this.loop()) {
          newIndex = tabs.length - 1;
        } else {
          return undefined;
        }
      }
    } while (tabs[newIndex].disabled);
    return newIndex;
  }

  private findNextAvailableTab(tabs: Tab[], currentIndex: number): number | undefined {
    let newIndex = currentIndex;
    do {
      newIndex++;
      if (newIndex >= tabs.length) {
        if (this.loop()) {
          newIndex = 0;
        } else {
          return undefined;
        }
      }
    } while (tabs[newIndex].disabled);
    return newIndex;
  }

  @HostListener('focusout', ['$event'])
  handleFocusOut(event: FocusEvent) {
    const focusTargetElement = event.relatedTarget as HTMLElement;

    if (this.focusedTab && !this.elRef.nativeElement.contains(focusTargetElement)) {
      this.renderer.setAttribute(this.focusedTab?.elementRef.nativeElement, 'tabindex', '-1');
      const currentTabHTMLElement = this.state.selectedTab()?.elementRef.nativeElement;
      this.renderer.setAttribute(currentTabHTMLElement, 'tabindex', '0');
      this.focusedTab = null;
    }
  }
}
