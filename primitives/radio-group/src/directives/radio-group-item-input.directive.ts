import { Directive, ElementRef, Renderer2, computed, effect, inject, input } from '@angular/core';
import { RadioGroupService } from '../state/radio-group-state.service';
import { hostBinding } from '@vacui-ui/primitives/utils';

@Directive({
  selector: '[vacRadioGroupInput]',
  standalone: true,
  exportAs: 'vacRadioGroupInput',
  host: { type: 'radio', tabindex: '-1', 'aria-hidden': 'true' },
})
export class RadioGroupInputDirective {
  state = inject(RadioGroupService);
  private element: HTMLElement = inject(ElementRef).nativeElement;
  private renderer = inject(Renderer2);

  value = input.required<string>();

  isChecked = computed(() => this.state.value() === this.value());
  disabled = computed(() => {
    return this.state.disabled() || this.state.radioItems.get(this.value())?.disabled() ? '' : null;
  });

  constructor() {
    this.setStyles();

    hostBinding('attr.data-disabled', this.disabled);
    hostBinding('attr.disabled', this.disabled);
    hostBinding('attr.name', this.state.name);
    hostBinding(
      'attr.required',
      computed(() => this.state.required() ?? null),
    );

    effect(() => {
      this.renderer.setProperty(this.element, 'checked', this.isChecked());
      this.renderer.setAttribute(this.element, 'value', this.value());
      this.renderer.setAttribute(this.element, 'data-state', this.isChecked() ? 'checked' : 'unchecked');
    });
  }

  private setStyles() {
    this.renderer.setProperty(this.element, 'style', `
      transform: translateX(-100%);
      position: absolute;
      pointer-vents: none;
      opacity: 0;
      margin: 0px;
      width: 25px;
      height: 25px;
    `);
  }
}
