import { NgModule } from '@angular/core';
import { SliderRootDirective } from './directives/slider-root.directive';
import { SliderRangeDirective } from './directives/slider-range.directive';
import { SliderTrackDirective } from './directives/slider-track.directive';
import { SliderThumbDirective } from './directives/slider-thumb.directive';
import { SliderInputDirective } from './directives/slider-input.directive'

const sliderDirectives = [
  SliderRootDirective,
  SliderRangeDirective,
  SliderTrackDirective,
  SliderThumbDirective,
  SliderInputDirective
];

@NgModule({
  imports: [...sliderDirectives],
  exports: [...sliderDirectives],
})
export class SliderPrimitivesModule {}
