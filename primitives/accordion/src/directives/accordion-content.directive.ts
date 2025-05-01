import { Directive, computed, inject } from '@angular/core';
import { AccordionStateService } from '../state/accordion.service';
import { AccordionItemDirective } from './accordion-item.directive';
import { hostBinding } from '@vacui-ui/primitives/utils';

@Directive({
  selector: '[vacAccordionContent]',
  standalone: true,
  exportAs: 'vacAccordionContent',
})
export class AccordionContentDirective {
  state = inject(AccordionStateService);
  private item = inject(AccordionItemDirective);

  constructor() {
    hostBinding('attr.id', computed(() => this.state.generateAriaControlId(this.item.id, this.item.value(), 'panel')));
    hostBinding('attr.role', computed(() => this.state.itemsCount() <= 6 ? 'region' : null));
    hostBinding('attr.aria-labelledby', computed(() => this.state.generateAriaControlId(this.item.id, this.item.value(), 'trigger')));
    hostBinding('attr.aria-disabled', computed(() => this.item.getItem().state === 'open' && this.state.disabled() ? true : null));
    hostBinding('attr.data-state', computed(() => this.item.getItem().state));
    hostBinding('attr.data-disabled', computed(() => this.item.disabled() || this.state.disabled() ? '' : null));
    hostBinding('attr.data-orientation', this.state.orientation);
  }
}
