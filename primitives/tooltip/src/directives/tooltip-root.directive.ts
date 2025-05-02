import { Directive, inject } from '@angular/core';
import { TooltipService } from '../controller/tooltip.service';

@Directive({
  selector: '[vacTooltipRoot]',
  exportAs: 'vacTooltipRoot',
  standalone: true,
  providers: [TooltipService],
  inputs: ['open', 'openDelay', 'closeDelay'],
})
export class TooltipRootDirective {
  state = inject(TooltipService);

  set open(open: boolean) {
    this.state.open.set(open);
  }

  set openDelay(openDelay: number) {
    this.state.openDelay.set(openDelay);
  }

  set closeDelay(closeDelay: number) {
    this.state.closeDelay.set(closeDelay);
  }
}
