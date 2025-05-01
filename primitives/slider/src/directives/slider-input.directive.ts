import { Directive, computed, inject } from '@angular/core';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { SliderStateService } from '../state/slider.state.service';

@Directive({
  selector: 'input[vacSliderInput]',
  standalone: true,
  exportAs: 'vacSliderInput',
  host: { hidden: 'true' },
})
export class SliderInputDirective {
  state = inject(SliderStateService);

  constructor() {
    hostBinding('attr.name', this.state.name);
    hostBinding(
      'attr.value',
      computed(() => {
        const value = this.state.value();
        if (value.length > 1) {
          return value.join(', ');
        } else if (value.length > 0) {
          return value[0].toString();
        } else {
          return 0;
        }
      }),
    );
  }
}
