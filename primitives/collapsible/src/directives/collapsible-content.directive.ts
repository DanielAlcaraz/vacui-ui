import { Directive, ElementRef, Renderer2, effect, inject } from '@angular/core';
import { CollapsibleStateService } from '../state/collapsible.service';
import { CollapsibleDataState } from '../models/collapsible.models';

@Directive({
  selector: '[vacCollapsibleContent]',
  exportAs: 'vacCollapsibleContent',
  standalone: true
})
export class CollapsibleContentDirective {
  state = inject(CollapsibleStateService);
  private renderer = inject(Renderer2);
  private element = inject(ElementRef).nativeElement;

  constructor() {
    effect(() => {
      const state: CollapsibleDataState = this.state.open() ? 'open' : 'closed';
      this.renderer.setAttribute(this.element, 'data-state', state);

      if (this.state.disabled()) {
        this.renderer.setAttribute(this.element, 'data-disabled', '');
      } else {
        this.renderer.removeAttribute(this.element, 'data-disabled');
      }
    });

    this.renderer.setAttribute(this.element, 'id', this.state.getContentId());
  }
}
