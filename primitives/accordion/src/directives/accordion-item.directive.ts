import { Directive, OnDestroy, OnInit, computed, effect, inject, input } from '@angular/core';
import { generateRandomId, hostBinding } from '@vacui-ui/primitives/utils';
import { AccordionItem } from '../model/accordion.model';
import { AccordionStateService } from '../state/accordion.service';

@Directive({
  selector: '[vacAccordionItem]',
  standalone: true,
  exportAs: 'vacAccordionItem',
})
export class AccordionItemDirective implements OnInit, OnDestroy {
  state = inject(AccordionStateService)
  value = input.required<string>();
  disabled = input(false);
  id = generateRandomId();

  constructor() {
    hostBinding('attr.data-state', computed(() => this.getItem().state));
    hostBinding('attr.data-orientation', this.state.orientation);
    hostBinding('attr.data-disabled', computed(() => this.disabled() || this.state.disabled() ? '' : null));
  }

  ngOnInit() {
    const initialState = this.state.isInitiallyOpen(this.value()) ? 'open' : 'closed';
    this.state.addItem({
      id: this.value(),
      value: this.value(),
      disabled: this.disabled(),
      state: initialState,
    });
  }

  getItem(): AccordionItem {
    return this.state.getItem(this.value())!;
  }

  ngOnDestroy() {
    this.state.removeItem(this.value());
  }
}
