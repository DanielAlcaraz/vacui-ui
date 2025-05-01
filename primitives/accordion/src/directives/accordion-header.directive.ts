import { Directive, computed, inject, input } from '@angular/core';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { AccordionStateService } from '../state/accordion.service';
import { AccordionItemDirective } from './accordion-item.directive';

export type AriaLevel = '1' | '2' | '3' | '4' | '5' | '6';

@Directive({
  selector: '[vacAccordionHeader]',
  standalone: true,
  exportAs: 'vacAccordionHeader',
  host: { role: 'heading' }
})
export class AccordionHeaderDirective {
  state = inject(AccordionStateService);
  level = input.required<AriaLevel>({ alias: 'vacAccordionHeader' });
  private item = inject(AccordionItemDirective);

  constructor() {
    hostBinding('attr.aria-level', this.level);
    hostBinding('attr.data-state', computed(() => this.item.getItem().state));
    hostBinding('attr.data-state', computed(() => this.item.disabled() || this.state.disabled() ? '' : null));
    hostBinding('attr.data-orientation', this.state.orientation);
  }
}
