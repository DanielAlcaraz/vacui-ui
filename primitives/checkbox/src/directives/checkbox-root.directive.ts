import { Directive, ElementRef, HostListener, Renderer2, effect, inject, output } from '@angular/core';
import { CheckboxStatus, CheckboxValue } from '../models/checkbox.models';
import { CheckboxStateService } from '../state/checkbox.service';

@Directive({
  selector: '[vacCheckboxRoot]',
  providers: [CheckboxStateService],
  exportAs: 'vacCheckboxRoot',
  inputs: ['checked', 'disabled', 'required', 'name', 'value'],
  standalone: true,
})
export class CheckboxRootDirective {
  state = inject(CheckboxStateService);
  private element = inject(ElementRef).nativeElement;
  private renderer = inject(Renderer2);

  set checked(value: CheckboxValue) {
    this.state.checked.set(value);
  }

  set disabled(value: boolean) {
    this.state.disabled.set(value);
  }

  set required(value: boolean) {
    this.state.required.set(value);
  }

  set name(value: string) {
    this.state.name.set(value);
  }

  set value(value: string) {
    this.state.value.set(value);
  }

  checkedChange = output<CheckboxValue>();

  constructor() {
    this.setAttributes(this.element);

    effect(() => {
      const checked = this.state.checked();
      const dataState: CheckboxStatus =
        checked === true ? 'checked' : checked === false ? 'unchecked' : 'indeterminate';
      this.renderer.setAttribute(this.element, 'data-state', dataState);

      const ariaChecked = checked === true ? 'true' : checked === false ? 'false' : 'mixed';
      this.renderer.setAttribute(this.element, 'aria-checked', ariaChecked);
      this.checkedChange.emit(checked);
    });

    effect(() => {
      if (this.state.disabled()) {
        this.renderer.setAttribute(this.element, 'data-disabled', '');
      } else {
        this.renderer.removeAttribute(this.element, 'data-disabled');
      }
    });
  }

  @HostListener('click')
  onClick() {
    if (!this.state.disabled()) {
      this.state.toggleChecked();
    }
  }

  @HostListener('keydown.space', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.state.disabled()) {
      this.state.toggleChecked();
      event.preventDefault();
    }
  }

  private setAttributes(element: HTMLElement) {
    this.renderer.setAttribute(element, 'role', 'checkbox');
    this.renderer.setAttribute(element, 'aria-checked', 'false');
    this.renderer.setAttribute(element, 'data-state', 'unchecked');
  }
}
