import { Directive, computed, input } from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { SeparatorOrientation } from './separator.model';

@Directive({
  selector: '[vacSeparatorRoot]',
  standalone: true,
  exportAs: 'vacSeparatorRoot'
})
export class SeparatorRootDirective {
  orientation = input<SeparatorOrientation>('horizontal');
  decorative = input(false);

  constructor() {
    hostBinding('attr.role', computed(() => this.decorative() ? 'none' : 'separator'));
    hostBinding('attr.aria-orientation', computed(() => this.decorative() ? null : this.orientation()));
    hostBinding('attr.data-orientation', this.orientation);
  }
}
