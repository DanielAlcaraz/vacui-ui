import { Directive, inject, input, output } from '@angular/core';
import { connectSignals, hostBinding } from '@vacui-kit/primitives/utils';
import { DialogStateService } from '../state/dialog-state.service';

@Directive({
  selector: '[vacDialogRoot]',
  exportAs: 'vacDialogRoot',
  standalone: true,
  providers: [DialogStateService],
})
export class DialogRootDirective {
  state = inject(DialogStateService);
  open = input(false);
  openChange = output<boolean>();
  modal = input(true);

  constructor() {
    connectSignals(this.open, this.state.open, this.openChange);
    connectSignals(this.modal, this.state.modal);
    hostBinding('data-state', this.state.dataState);
  }
}
