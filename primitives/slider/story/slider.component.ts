import { Component, input } from '@angular/core';
import { SliderPrimitivesModule } from '../src/slider.module';

@Component({
  selector: 'vacui-ui-slider',
  standalone: true,
  imports: [SliderPrimitivesModule],
  template: `
    <span
      vacSliderRoot
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [value]="value()"
      [orientation]="orientation()"
      [inverted]="inverted()"
      [minStepsBetweenThumbs]="minStepsBetweenThumbs()"
      [disabled]="disabled()"
      class="relative flex h-[18px] w-[400px] items-center rounded-full"
    >
      <span vacSliderTrack class="h-[3px] w-full bg-black/20 rounded-full">
        <span vacSliderRange class="bg-gray-900 rounded-full h-full"></span>
      </span>
      @for (item of value(); track $index) {
        <span
          vacSliderThumb
          class="h-5 w-5 rounded-full bg-gray-700 cursor-pointer focus:ring-4 focus:ring-black/40"
          aria-label="Volume"
        ></span>
      }
      <input vacSliderInput />
    </span>
  `,
})
export class SliderComponent {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly minStepsBetweenThumbs = input(5);
  readonly disabled = input(false);
  readonly value = input<number[]>([0]);
  readonly inverted = input(false);
  readonly orientation = input<"horizontal" | "vertical">('vertical');
}

@Component({
  selector: 'vac-vertical-slider',
  standalone: true,
  imports: [SliderPrimitivesModule],
  template: `
    <span
      vacSliderRoot
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [value]="value()"
      [orientation]="orientation()"
      [disabled]="disabled()"
      [inverted]="inverted()"
      class="relative flex h-[200px] w-[10px] flex-col items-center rounded-full"
    >
      <span vacSliderTrack class="h-full w-[3px] bg-black/40 rounded-full">
        <span vacSliderRange class="w-full bg-gray-900 rounded-full h-full"></span>
      </span>
      @for (item of value(); track $index) {
        <span
          vacSliderThumb
          class="h-5 w-5 rounded-full bg-gray-700 cursor-pointer focus:ring-4 focus:ring-black/40"
          aria-label="Volume"
        ></span>
      }
      <input vacSliderInput />
    </span>
  `,
})
export class VerticalSliderComponent {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false);
  readonly inverted = input(false);
  readonly orientation = input<"horizontal" | "vertical">('vertical');
  readonly value = input<number[]>([0]);
}