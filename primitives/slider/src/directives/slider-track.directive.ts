import { Directive, ElementRef, computed, inject } from '@angular/core';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { SliderStateService } from '../state/slider.state.service';

@Directive({
  selector: '[vacSliderTrack]',
  standalone: true,
  exportAs: 'vacSliderTrack',
})
export class SliderTrackDirective {
  state = inject(SliderStateService);
  private element = inject(ElementRef).nativeElement;

  constructor() {
    this.state.trackElement = this.element;

    hostBinding('attr.data-orientation', this.state.orientation);
    hostBinding('attr.data-disabled', this.state.disabled);
    hostBinding(
      'style',
      computed(() => {
        if (this.state.orientation() === 'horizontal') {
          return {
            position: 'absolute',
            left: '0',
            right: '0',
          };
        } else {
          return {
            position: 'absolute',
            top: '0',
            bottom: '0',
          };
        }
      }),
    );
  }
}
