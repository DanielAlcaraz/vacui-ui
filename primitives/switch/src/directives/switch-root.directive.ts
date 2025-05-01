import { Directive, ElementRef, HostListener, computed, inject, input, model } from '@angular/core';
import { generateRandomId, hostBinding } from '@vacui-ui/primitives/utils';

@Directive({
  selector: '[vacSwitchRoot]',
  standalone: true,
  exportAs: 'vacSwitchRoot',
  host: {
    role: 'switch',
  },
})
export class SwitchRootDirective {
  checked = model(false);
  disabled = input(false);
  required = input(false);
  name = input(generateRandomId());
  value = input('on');
  element = inject(ElementRef).nativeElement as HTMLElement;

  dataState = hostBinding(
    'attr.data-state',
    computed(() => (this.checked() ? 'checked' : 'unchecked')),
  );

  dataDisabled = hostBinding(
    'attr.data-disabled',
    computed(() => (this.disabled() ? 'true' : null)),
  );

  constructor() {
    hostBinding('attr.aria-checked', this.checked);
    hostBinding('attr.aria-required', this.required);
    hostBinding(
      'disabled',
      computed(() => (this.disabled() ? 'true' : null)),
    );
  }

  @HostListener('click', ['$event'])
  @HostListener('keydown.space', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  toggleSwitch(event: KeyboardEvent) {
    if (this.disabled()) return;
    this.checked.update((value) => !value);
    event.preventDefault();
  }
}
