import { Directive, computed, inject } from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { RadioGroupService } from '../state/radio-group-state.service';
import { RadioGroupItemDirective } from './radio-group-item.directive';

@Directive({
  selector: '[vacRadioGroupIndicator]',
  standalone: true,
  exportAs: 'vacRadioGroupIndicator',
})
export class RadioGroupIndicatorDirective  {
  state = inject(RadioGroupService);
  private radioItem = inject(RadioGroupItemDirective);

  constructor() {
    hostBinding(
      'attr.data-disabled',
      computed(() => (this.radioItem.disabled() || this.state.disabled() ? '' : null)),
    );

    hostBinding(
      'attr.data-state',
      computed(() => (this.radioItem.isChecked() ? 'checked' : 'unchecked')),
    );
  }
}
