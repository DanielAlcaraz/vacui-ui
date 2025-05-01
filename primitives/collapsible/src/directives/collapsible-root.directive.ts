import { Directive, inject, effect, Renderer2, ElementRef, input, model, output } from '@angular/core';
import { CollapsibleStateService } from '../state/collapsible.service';
import { connectSignals } from '@vacui-ui/primitives/utils';

@Directive({
  selector: '[vacCollapsibleRoot]',
  standalone: true,
  providers: [CollapsibleStateService],
  exportAs: 'vacCollapsibleRoot',
})
export class CollapsibleRootDirective {
  state = inject(CollapsibleStateService);
  private renderer = inject(Renderer2);
  private element = inject(ElementRef).nativeElement;

  disabled = input(this.state.disabled());
  open = input(this.state.open());
  openChange = output<boolean>();

  constructor() {
    connectSignals(this.open, this.state.open, this.openChange);
    connectSignals(this.disabled, this.state.disabled);

    effect(() => {
      const openValue = this.state.open();
      this.renderer.setAttribute(this.element, 'data-state', openValue ? 'open' : 'closed');

      if (this.state.disabled()) {
        this.renderer.setAttribute(this.element, 'data-disabled', '');
      } else {
        this.renderer.removeAttribute(this.element, 'data-disabled');
      }
    });
  }
}
