import { Directive, computed, inject } from '@angular/core';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { DialogStateService } from '../state/dialog-state.service';

@Directive({
  selector: '[vacDialogTitle]',
  exportAs: 'vacDialogTitle',
  standalone: true,
})
export class DialogTitleDirective {
  state = inject(DialogStateService);

  constructor() {
    hostBinding('data-state', this.state.dataState);
    hostBinding('id', computed(() => this.state.titleId));
  }
}
