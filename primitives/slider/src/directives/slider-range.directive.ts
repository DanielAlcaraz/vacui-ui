import { Directive, HostBinding, computed, effect, inject } from '@angular/core';
import { SliderStateService } from '../state/slider.state.service';
import { hostBinding } from '@vacui-ui/primitives/utils';

@Directive({
  selector: '[vacSliderRange]',
  standalone: true,
  exportAs: 'vacSliderRange',
})
export class SliderRangeDirective {
  state = inject(SliderStateService);

  constructor() {
    hostBinding('attr.data-orientation', this.state.orientation);
    hostBinding('attr.data-disabled', this.state.disabled);
    hostBinding(
      'style',
      computed(() => {
        const { minValue, maxValue } = this.determineRangeBoundaries();
        const { leftPercent, rightPercent } = this.convertBoundariesToPercentages(minValue, maxValue);

        if (this.state.orientation() === 'horizontal') {
          return {
            position: 'absolute',
            left: `${leftPercent}%`,
            right: `${rightPercent}%`,
            height: '100%',
          };
        } else {
          const heightPercent = 100 - rightPercent - leftPercent;
          return {
            position: 'absolute',
            top: `${rightPercent}%`,
            height: `${heightPercent}%`,
            width: '100%',
          };
        }
      }),
    );
  }

  // Determine the range boundaries based on the slider's values
  private determineRangeBoundaries() {
    const values = this.state.value();
    let minValue = this.state.min();
    let maxValue = this.state.max();

    if (values.length >= 2) {
      minValue = Math.min(...values);
      maxValue = Math.max(...values);
    } else if (values.length === 1) {
      maxValue = values[0];
    }

    return { minValue, maxValue };
  }

  // Convert the range boundaries to percentage values
  private convertBoundariesToPercentages(minValue: number, maxValue: number) {
    if (this.state.inverted()) {
      const leftPercent = 100 - ((maxValue - this.state.min()) / (this.state.max() - this.state.min())) * 100;
      const rightPercent = ((minValue - this.state.min()) / (this.state.max() - this.state.min())) * 100;
      return { leftPercent, rightPercent };
    } else {
      const leftPercent = ((minValue - this.state.min()) / (this.state.max() - this.state.min())) * 100;
      const rightPercent = 100 - ((maxValue - this.state.min()) / (this.state.max() - this.state.min())) * 100;
      return { leftPercent, rightPercent };
    }
  }
}
