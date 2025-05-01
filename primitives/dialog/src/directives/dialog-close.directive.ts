import { Directive, HostListener, inject } from '@angular/core';
import { hostBinding, isSelectionKey } from '@vacui-ui/primitives/utils';
import { DialogStateService } from '../state/dialog-state.service';

@Directive({
  selector: '[vacDialogClose]',
  exportAs: 'vacDialogClose',
  standalone: true,
})
export class DialogCloseDirective {
  state = inject(DialogStateService);

  constructor() {
    hostBinding('data-state', this.state.dataState);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();
    this.state.open.update((open) => !open);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (isSelectionKey(event, { Tab: false })) {
      event.preventDefault();
      this.state.open.update((open) => !open);
    }
  }
}
