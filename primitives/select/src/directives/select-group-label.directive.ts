import { Directive, inject } from '@angular/core';
import { SelectGroupDirective } from './select-group.directive';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { SelectStateService } from '../state/select-state.service';

@Directive({
  selector: '[vacSelectGroupLabel]',
  exportAs: 'vacSelectGroupLabel',
  standalone: true,
})
export class SelectGroupLabelDirective {
  state = inject(SelectStateService);
  private group = inject(SelectGroupDirective);

  constructor() {
    hostBinding('id', this.group.labelledby);
  }
}
