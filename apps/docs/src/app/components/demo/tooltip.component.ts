import { Component } from '@angular/core';
import {
  TooltipRootDirective,
  TooltipContentDirective,
  TooltipArrowDirective,
  TooltipTriggerDirective,
} from '@vacui-kit/primitives/tooltip';
import { PortalDirective } from '@vacui-kit/primitives/portal';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'vac-tooltip-demo',
  standalone: true,
  imports: [
    PortalDirective,
    TooltipRootDirective,
    TooltipContentDirective,
    TooltipArrowDirective,
    TooltipTriggerDirective,
  ],
  template: `
    <div>
      <ng-container vacTooltipRoot [openDelay]="300">
        <button
          type="button"
          vacTooltipTrigger
          class="p-3 px-5 border-2 border-orange-600 bg-orange-50 text-orange-800 rounded-lg font-medium hover:bg-orange-100 transition-colors"
          aria-label="Tooltip Demo"
        >
          Hover Me
        </button>

        <ng-container *vacPortal>
          <div
            *vacTooltipContent="'top'"
            class="p-3 bg-orange-800 text-white border-none absolute w-fit rounded-md shadow-lg max-w-xs"
            [@fadeInOut]
          >
            <p class="text-sm text-center">
              This is a styled tooltip that appears above the button.
            </p>
            <div vacTooltipArrow class="text-orange-800"></div>
          </div>
        </ng-container>
      </ng-container>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(10px)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'translateY(5px)' })
        ),
      ]),
    ]),
  ],
  styles: [
    `
      :host {
        display: block;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, sans-serif;
      }
    `,
  ],
})
export class TooltipComponent {}
