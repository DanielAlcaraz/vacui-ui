import { Directive, ElementRef, Renderer2, effect, inject } from '@angular/core';
import { CheckboxStateService } from '../state/checkbox.service';

@Directive({
  selector: 'input[vacCheckboxInput]',
  standalone: true,
  exportAs: 'vacCheckboxInput',
})
export class CheckboxInputDirective {
  state = inject(CheckboxStateService);
  private renderer = inject(Renderer2);
  private element: HTMLInputElement = inject(ElementRef<HTMLInputElement>).nativeElement;

  constructor() {
    this.setStyle(this.element);
    this.setAttributes(this.element);

    effect(() => {
      const checked = this.state.checked();
      if (checked === 'indeterminate') {
        this.renderer.setAttribute(this.element, 'aria-checked', 'mixed');
        this.renderer.setAttribute(this.element, 'data-state', 'indeterminate');
        this.renderer.setProperty(this.element, 'indeterminate', true);
        this.renderer.setProperty(this.element, 'checked', false);
      } else {
        this.renderer.setProperty(this.element, 'indeterminate', false);
        this.renderer.setProperty(this.element, 'checked', checked);
        this.renderer.setAttribute(this.element, 'aria-checked', checked ? 'true' : 'false');
        this.renderer.setAttribute(this.element, 'data-state', checked ? 'checked' : 'unchecked');
      }

      if (this.state.required()) {
        this.renderer.setAttribute(this.element, 'required', '');
      } else {
        this.renderer.removeAttribute(this.element, 'required');
      }

      if (this.state.disabled()) {
        this.renderer.setAttribute(this.element, 'disabled', '');
        this.renderer.setAttribute(this.element, 'data-disabled', '');
      } else {
        this.renderer.removeAttribute(this.element, 'disabled');
        this.renderer.removeAttribute(this.element, 'data-disabled');
      }

      this.renderer.setAttribute(this.element, 'name', this.state.name());
      this.renderer.setAttribute(this.element, 'value', this.state.value());
    });
  }

  private setAttributes(element: HTMLInputElement) {
    this.renderer.setAttribute(element, 'type', 'checkbox');
    this.renderer.setAttribute(element, 'hidden', 'true');
    this.renderer.setAttribute(element, 'aria-hidden', 'true');
    this.renderer.setAttribute(element, 'tabindex', '-1');

    if (this.state.checked() === true) {
      this.renderer.setAttribute(element, 'checked', '');
    }
  }

  private setStyle(element: HTMLInputElement) {
    this.renderer.setStyle(element, 'transform', 'translateX(-100%)');
    this.renderer.setStyle(element, 'position', 'absolute');
    this.renderer.setStyle(element, 'pointEvents', 'none');
    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'margin', '0px');
    this.renderer.setStyle(element, 'width', '25px');
    this.renderer.setStyle(element, 'height', '25px');
  }
}
