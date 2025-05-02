import { Directive, ElementRef, HostListener, Renderer2, effect, inject } from '@angular/core';
import { CollapsibleDataState } from '../models/collapsible.models';
import { CollapsibleStateService } from '../state/collapsible.service';

@Directive({
  selector: '[vacCollapsibleTrigger]',
  exportAs: 'vacCollapsibleTrigger',
  standalone: true,
})
export class CollapsibleTriggerDirective {
  state = inject(CollapsibleStateService);
  private renderer = inject(Renderer2);
  private element = inject(ElementRef).nativeElement;

  constructor() {
    effect(() => {
      const state: CollapsibleDataState = this.state.open() ? 'open' : 'closed';
      this.renderer.setAttribute(this.element, 'data-state', state);
      this.renderer.setAttribute(this.element, 'aria-expanded', this.state.open() ? 'true' : 'false');

      if (this.state.disabled()) {
        this.renderer.setAttribute(this.element, 'data-disabled', '');
      } else {
        this.renderer.removeAttribute(this.element, 'data-disabled');
      }
    });

    this.renderer.setAttribute(this.element, 'aria-controls', this.state.getContentId());
  }

  @HostListener('click')
  onClick() {
    this.state.toggleOpen();
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.state.toggleOpen();
      event.preventDefault();
    }
  }
}
