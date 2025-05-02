import { Directive, computed, inject, input } from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { SelectStateService } from '../state/select-state.service';

@Directive({
  selector: '[vacSelectValue]',
  standalone: true,
  exportAs: 'vacSelectValue',
  inputs: ['displayWith'],
})
export class SelectValueDirective {
  // TODO: Allow to pass a template to render different selected options or update/create a new structural directive
  state = inject(SelectStateService);

  displayValue = computed<string | null>(() => this.getDisplayValue());
  displayText = hostBinding('innerText', this.displayValue);

  placeholder = input('');
  displayWith: ((value: string) => string) | null = null;

  private getDisplayValue(): string | null {
    if (!this.state.items().length) return null;

    const placeholder = this.placeholder();
    const values = this.state.selectedValues();
    if (!values.length) return placeholder;

    if (this.state.multiple()) {
      if (this.displayWith) {
        return values.map(this.displayWith).join(', ');
      }

      return values.map((value) => this.state.findLabelByValue(value)).join(', ');
    } else {
      if (this.displayWith) return this.displayWith(values[0]);
      return this.state.findLabelByValue(values[0]);
    }
  }
}
