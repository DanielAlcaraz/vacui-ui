import { Component, input } from '@angular/core';
import { TooltipPosition } from '../src/model/tooltip.model';
import { TooltipPrimitivesModule } from '../src/tooltip.module';
import { SliderPrimitivesModule } from '@vacui-kit/primitives/slider';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PortalDirective } from '@vacui-kit/primitives/portal';

@Component({
  selector: 'vacui-ui-tooltip',
  standalone: true,
  imports: [TooltipPrimitivesModule, SliderPrimitivesModule, PortalDirective],
  template: `
    <div>
      <div class="grid grid-cols-4 gap-4">
        @for (button of buttons; track $index) {
          <ng-container vacTooltipRoot [openDelay]="300">
            <button
              type="button"
              vacTooltipTrigger
              class="p-2 px-3 border border-black relative"
              [attr.aria-label]="button.label"
            >
              {{ button.text }}
            </button>

            <ng-container *vacPortal>
              <div *vacTooltipContent="button.side" class="p-2 bg-black text-white border-none absolute w-fit rounded" [@fadeInOut]>
                  <p>{{ button.tooltip }}</p>
                  <div vacTooltipArrow class="text-black"></div>
              </div>
            </ng-container>
          </ng-container>
        }
      </div>

      <div class="pt-16 px-8">
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
        class="relative flex h-[18px] w-full items-center rounded-full"
      >
        <span vacSliderTrack class="h-[3px] w-full bg-black/20 rounded-full">
          <span vacSliderRange class="bg-gray-900 rounded-full h-full"></span>
        </span>
        @for (item of value(); track $index) {
          <ng-container vacTooltipRoot [open]="true">
            <span
              vacSliderThumb
              vacTooltipTrigger
              class="h-5 w-5 rounded-full bg-gray-700 cursor-pointer focus:ring-4 focus:ring-black/40"
              aria-label="Volume"
            >
                <div *vacTooltipContent="'top'" class="p-2 bg-black text-white border-none absolute w-fit">
                  <p>{{ item }}</p>
                  <div vacTooltipArrow class="text-black"></div>
                </div>
            </span>
          </ng-container>
        }
        <input vacSliderInput />
      </span>
    </div>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('100ms ease-out', style({ opacity: 0 }))])
    ]),
  ],
})
export class TooltipComponent {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly minStepsBetweenThumbs = input(5);
  readonly disabled = input(false);
  readonly value = input<number[]>([0]);
  readonly inverted = input(false);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  buttons: {
    side: TooltipPosition;
    label: string;
    text: string;
    tooltip: string;
  }[] = [
    { side: 'top', label: 'Add top', text: 'Top', tooltip: 'This is a long tooltip content above the element.' },
    { side: 'top', label: 'Add top', text: 'Top', tooltip: 'This is a long tooltip content above the element.' },
    { side: 'top', label: 'Add top', text: 'Top', tooltip: 'This is a long tooltip content above the element.' },
    { side: 'top', label: 'Add top', text: 'Top', tooltip: 'This is a long tooltip content above the element.' },
    { side: 'right', label: 'Add right', text: 'Right', tooltip: 'This is a long tooltip content on the right side.' },
    { side: 'right', label: 'Add right', text: 'Right', tooltip: 'This is a long tooltip content on the right side.' },
    { side: 'right', label: 'Add right', text: 'Right', tooltip: 'This is a long tooltip content on the right side.' },
    { side: 'right', label: 'Add right', text: 'Right', tooltip: 'This is a long tooltip content on the right side.' },
    { side: 'bottom', label: 'Add bottom', text: 'Bottom', tooltip: 'This is a long tooltip content on the bottom.' },
    { side: 'bottom', label: 'Add bottom', text: 'Bottom', tooltip: 'This is a long tooltip content on the bottom.' },
    { side: 'bottom', label: 'Add bottom', text: 'Bottom', tooltip: 'This is a long tooltip content on the bottom.' },
    { side: 'bottom', label: 'Add bottom', text: 'Bottom', tooltip: 'This is a long tooltip content on the bottom.' },
    { side: 'left', label: 'Add left', text: 'Left', tooltip: 'This is a long tooltip content on the left side.' },
    { side: 'left', label: 'Add left', text: 'Left', tooltip: 'This is a long tooltip content on the left side.' },
    { side: 'left', label: 'Add left', text: 'Left', tooltip: 'This is a long tooltip content on the left side.' },
    { side: 'left', label: 'Add left', text: 'Left', tooltip: 'This is a long tooltip content on the left side.' },
    { side: 'top', label: 'Add top', text: 'Top', tooltip: 'This is a long tooltip content above the element.' },
    { side: 'top', label: 'Add top', text: 'Top', tooltip: 'This is a long tooltip content above the element.' },
    { side: 'top', label: 'Add top', text: 'Top', tooltip: 'This is a long tooltip content above the element. This is a long tooltip content above the element.' },
    { side: 'top', label: 'Add top', text: 'Top', tooltip: 'This is a long tooltip content above the element.' },
  ];
}
