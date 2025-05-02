import { Directive, signal } from '@angular/core';
import { generateRandomId, hostBinding } from '@vacui-kit/primitives/utils';

@Directive({
  selector: '[vacSelectGroup]',
  exportAs: 'vacSelectGroup',
  standalone: true,
  host: { role: 'group' },
})
export class SelectGroupDirective {
  // select-label directive use it to set an in ID
  labelledby = hostBinding('attr.aria-labelledby', signal(`select-label-${generateRandomId()}`));
}
