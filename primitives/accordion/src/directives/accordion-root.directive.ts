import { Directive, inject, input, output } from '@angular/core';
import { KeyNavigationRootDirective } from '@vacui-kit/primitives/key-navigation';
import { connectSignals, hostBinding } from '@vacui-kit/primitives/utils';
import { AccordionOrientation, AccordionValue } from '../model/accordion.model';
import { AccordionStateService } from '../state/accordion.service';

@Directive({
  selector: '[vacAccordionRoot]',
  standalone: true,
  exportAs: 'vacAccordionRoot',
  hostDirectives: [
    {
      directive: KeyNavigationRootDirective,
      inputs: [
        'navigationRules',
        'direction',
        'loop',
        'disabled',
        'tabNavigation',
        'focusCallback',
        'rememberLastFocus',
      ],
    },
  ],
  providers: [AccordionStateService],
  inputs: ['value'],
})
export class AccordionRootDirective {
  state = inject(AccordionStateService);
  multiple = input(this.state.multiple());
  orientation = input<AccordionOrientation>(this.state.orientation());
  collapsible = input(this.state.collapsible());
  disabled = input(this.state.disabled());
  readonly toggle = output<AccordionValue>();

  set value(value: AccordionValue) {
    this.state.value.set(value);
  }
  valueChange = output<AccordionValue>();

  constructor() {
    hostBinding('attr.data-orientation', this.state.orientation);

    connectSignals(this.multiple, this.state.multiple);
    connectSignals(this.orientation, this.state.orientation);
    connectSignals(this.collapsible, this.state.collapsible);
    connectSignals(this.disabled, this.state.disabled);

    this.toggle.subscribe(() => {
      const openItems = this.state
        .items()
        .filter((i) => i.state === 'open')
        .map((i) => i.id);

      const itemToEmit = this.state.multiple() ? openItems : openItems[0];
      this.valueChange.emit(itemToEmit ?? null);
    });
  }
}
