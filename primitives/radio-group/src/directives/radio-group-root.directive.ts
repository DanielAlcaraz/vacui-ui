import { Directive, inject, input, model, output } from '@angular/core';
import { KeyboardNavigationService, KeyNavigationRootDirective } from '@vacui-ui/primitives/key-navigation';
import { connectSignals, hostBinding } from '@vacui-ui/primitives/utils';
import { RadioGroupService } from '../state/radio-group-state.service';

@Directive({
  selector: '[vacRadioGroupRoot]',
  providers: [RadioGroupService],
  standalone: true,
  exportAs: 'vacRadioGroupRoot',
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
  host: { role: 'radiogroup' },
})
export class RadioGroupRootDirective {
  state = inject(RadioGroupService);
  private keyboard = inject(KeyboardNavigationService);

  value = model<string | null>(this.state.value());
  valueChange = output<string | null>();
  name = input<string>(this.state.name());
  required = input(this.state.required());
  disabled = input(this.state.disabled());

  constructor() {
    this.keyboard.tabNavigation = false;
    this.keyboard.rememberLastFocused = true;

    connectSignals(this.value, this.state.value);
    connectSignals(this.name, this.state.name);
    connectSignals(this.required, this.state.required);
    connectSignals(this.disabled, this.state.disabled);

    hostBinding('attr.aria-required', this.state.required);
    hostBinding('attr.data-disabled', this.state.disabled);
  }
}
