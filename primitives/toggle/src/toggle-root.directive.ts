import { Directive, HostListener, computed, input, model } from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';

@Directive({
  selector: '[vacToggleRoot]',
  exportAs: 'vacToggleRoot',
  standalone: true,
})
export class ToggleRootDirective {
  pressed = model<boolean | null>(null);
  disabled = input(false);

  constructor() {
    hostBinding(
      'attr.data-state',
      computed(() => (this.pressed() ? 'on' : 'off')),
    );
    hostBinding(
      'attr.data-disabled',
      computed(() => (this.disabled() ? '' : null)),
    );
    hostBinding(
      'attr.aria-pressed',
      computed(() => (this.pressed() ? 'true' : 'false')),
    );
  }

  @HostListener('click') handleClick() {
    if (!this.disabled()) {
      this.pressed.update((pressed) => !pressed);
    }
  }

  @HostListener('keydown', ['$event']) handleKeydown(event: KeyboardEvent) {
    if (!this.disabled() && (event.key === 'Enter' || event.key === ' ' || event.key === 'Space')) {
      this.pressed.update((pressed) => !pressed);
      event.preventDefault();
    }
  }
}
