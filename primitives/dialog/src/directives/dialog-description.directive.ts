import { Directive, computed, inject } from '@angular/core';
import { DialogStateService } from '../state/dialog-state.service';
import { hostBinding } from '@vacui-kit/primitives/utils';

@Directive({
  selector: '[vacDialogDescription]',
  exportAs: 'vacDialogDescription',
  standalone: true,
})
export class DialogDescriptionDirective {
  state = inject(DialogStateService);

  constructor() {
    hostBinding('data-state', this.state.dataState);
    hostBinding('id', computed(() => this.state.descriptionId));
  }
}
