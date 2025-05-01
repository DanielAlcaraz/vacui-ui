import {
  Directive,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { generateRandomId } from '@vacui-ui/primitives/utils';
import { KeyboardNavigationService } from '../state/keyboard-navigation.service';

@Directive({
  selector: '[vacKeyNavigationItem]',
  standalone: true,
  exportAs: 'vacKeyNavigationItem'
})
export class KeyNavigationItemDirective implements OnInit, OnDestroy {
  state = inject(KeyboardNavigationService);
  private element = inject(ElementRef);
  private renderer = inject(Renderer2);
  private injector = inject(Injector);

  disabled = input(false);
  startFocus = model(false);
  id = generateRandomId();
  private isDisabled = computed(() => this.disabled() || this.state.disabled());

  @HostListener('click') onClick() {
    this.state.handleClick(this.id);
  }

  constructor() {
    this.renderer.setAttribute(this.element.nativeElement, 'data-navigable', this.id);

    effect(() => {
      if (this.isDisabled()) {
        this.renderer.setAttribute(this.element.nativeElement, 'disabled', 'true');
        this.renderer.setAttribute(this.element.nativeElement, 'aria-disabled', 'true');
        this.renderer.setAttribute(this.element.nativeElement, 'data-disabled', '');
      } else {
        this.renderer.removeAttribute(this.element.nativeElement, 'aria-disabled');
        this.renderer.removeAttribute(this.element.nativeElement, 'data-disabled');
        this.renderer.removeAttribute(this.element.nativeElement, 'disabled');
      }
    });
  }

  ngOnInit(): void {
    this.state.addElement({
      id: this.id,
      element: this.element,
      disabled: this.isDisabled(),
      startFocus: this.startFocus(),
    });

    effect(() => {
      this.state.updateElement(this.id, this.isDisabled(), this.startFocus());
    }, { injector: this.injector },);
  }

  ngOnDestroy() {
    this.state.removeElement(this.id);
  }
}
