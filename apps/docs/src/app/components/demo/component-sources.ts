/**
 * GENERATED FILE - DO NOT EDIT
 * This file contains component source code for the demo components
 * Generated on: 2025-05-05T22:43:10.433Z
 */

export const componentSources: Record<string, string> = {
  'tooltip': `import { Component } from '@angular/core';
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
  template: \`
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
  \`,
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
    \`
      :host {
        display: block;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
          Roboto, sans-serif;
      }
    \`,
  ],
})
export class TooltipComponent {}
`,
  'toggle': `import { Component, input } from '@angular/core';
import { ToggleRootDirective } from '@vacui-kit/primitives/toggle';

@Component({
  selector: 'vac-toggle',
  standalone: true,
  imports: [ToggleRootDirective],
  template: \`
    <button
      vacToggleRoot
      [pressed]="pressed()"
      [disabled]="disabled()"
      aria-label="Toggle notifications"
      class="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 bg-gray-200 text-gray-600 hover:bg-gray-300 data-[state=on]:bg-orange-600 data-[state=on]:text-white data-[state=on]:hover:bg-orange-700 data-[disabled]:cursor-not-allowed"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 003.536-1.003A8.967 8.967 0 0118 9.75V9A6 6 0 006.53 6.53m10.245 10.245L6.53 6.53M3 3l3.53 3.53"
        />
      </svg>
    </button>
  \`
})
export class ToggleComponent {
  pressed = input(false);
  disabled = input(false);
}
`,
  'toggleGroup': `import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ToggleGroupItemDirective, ToggleGroupRootDirective } from '@vacui-kit/primitives/toggle-group';

@Component({
  selector: 'vac-toggle-group',
  standalone: true,
  imports: [ToggleGroupItemDirective, ToggleGroupRootDirective, NgClass],
  template: \`
    <div
      vacToggleGroupRoot
      [attr.aria-label]="ariaLabel"
      [type]="type"
      [(value)]="value"
      [orientation]="orientation"
      [disabled]="disabled"
      [rovingFocus]="rovingFocus"
      [loop]="loop"
      class="flex"
      [ngClass]="{
        'flex-col': orientation === 'vertical',
        'flex-row': orientation === 'horizontal'
      }"
    >
      @for (item of toggleItems; track item.value; let i = \$index) {
        <button
          vacToggleGroupItem
          [value]="item.value"
          [attr.aria-label]="item.ariaLabel"
          class="toggle-item grid place-items-center text-base leading-6 h-9 w-9 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:bg-orange-500 data-[state=on]:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:z-10"
          [ngClass]="getItemClass(i)"
        >
          @switch (item.value) {
            @case ('bold') {
              <b>B</b>
            }
            @case ('italic') {
              <i>I</i>
            }
            @case ('underline') {
              <span class="underline">U</span>
            }
          }
        </button>
      }
    </div>
  \`,
})
export class ToggleGroupComponent {
  @Input() value: string | string[] = '';
  @Input() type: 'multiple' | 'single' = 'single';
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() disabled = false;
  @Input() rovingFocus = true;
  @Input() loop = false;
  @Input() ariaLabel = 'Text style';

  toggleItems = [
    { value: 'bold', ariaLabel: 'Bold text' },
    { value: 'italic', ariaLabel: 'Italic text' },
    { value: 'underline', ariaLabel: 'Underline text' },
  ];

  getItemClass(index: number): string {
    const isFirst = index === 0;
    const isLast = index === this.toggleItems.length - 1;
    const isMiddle = !isFirst && !isLast;

    return \`
      \${isFirst && this.orientation === 'horizontal' ? 'rounded-l-md' : ''}
      \${isFirst && this.orientation === 'vertical' ? 'rounded-t-md' : ''}
      \${isLast && this.orientation === 'horizontal' ? 'rounded-r-md' : ''}
      \${isLast && this.orientation === 'vertical' ? 'rounded-b-md' : ''}
      \${isMiddle && this.orientation === 'horizontal' ? 'border-l-0 border-r-0' : ''}
      \${isMiddle && this.orientation === 'vertical' ? 'border-t-0 border-b-0' : ''}
    \`;
  }
}
`,
  'tabs': `import { AnimationBuilder, animate, style } from '@angular/animations';
import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2, viewChild, viewChildren } from '@angular/core';
import { Orientation, TabsContentDirective, TabsListDirective, TabsRootDirective, TabsTriggerDirective } from '@vacui-kit/primitives/tabs';

@Component({
  selector: 'vac-tabs',
  standalone: true,
  imports: [NgClass, TabsContentDirective, TabsListDirective, TabsRootDirective, TabsTriggerDirective],
  template: \`
    <div vacTabsRoot [value]="selectedTab" [orientation]="orientation" (valueChange)="selectTab(\$event)">
      <nav
        vacTabsList
        [loop]="false"
        aria-label="Manage your account"
        class="isolate flex divide-x divide-gray-200 rounded-lg shadow relative"
      >
        @for (tab of tabDefinitions; track tab.id) {
          <button
            #tabsTrigger
            class=" rounded-lg group relative min-w-0 flex-1 w-28 sm:w-40 overflow-hidden py-4 px-4 text-center text-sm font-medium"
            [vacTabsTrigger]="tab.id"
            [disabled]="tab.disabled"
            [ngClass]="{ 'bg-gray-100 border-gray-400 border-2 text-gray-500 cursor-not-allowed': tab.disabled, 'bg-white hover:bg-gray-50 focus:outline-none focus:bg-orange-50': !tab.disabled}"
          >
            <span>{{ tab.title }}</span>
          </button>
        }
        <span #indicator class="absolute bottom-0 h-0.5 bg-orange-500 z-10"></span>
      </nav>

      <div *vacTabsContent="'tab1'" class="p-4 z-20">Content 1</div>
      <div *vacTabsContent="'tab2'" class="p-4 z-20">Content 2</div>
      <div *vacTabsContent="'tab3'" class="p-4 z-20">Content 3</div>
    </div>
  \`,
})
export class TabsComponent implements AfterViewInit {
  protected tabButtons = viewChildren<ElementRef>('tabsTrigger');
  protected indicator = viewChild.required<ElementRef>('indicator');

  selectedTab: string | null = 'tab1';
  orientation: Orientation = 'horizontal';
  tabDefinitions = [
    { title: 'Tab 1', id: 'tab1', disabled: false },
    { title: 'Tab 2', id: 'tab2', disabled: true },
    { title: 'Tab 3', id: 'tab3', disabled: false },
  ];

  constructor(
    private animBuilder: AnimationBuilder,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    this.moveActiveTab(false);
  }

  selectTab(tabValue: string | null) {
    console.log(tabValue);
    this.selectedTab = tabValue;
    this.moveActiveTab();
  }

  moveActiveTab(loadAnimation = true) {
    const activeTabElement = this.tabButtons().find(
      (btn, index) => this.tabDefinitions[index].id === this.selectedTab,
    )?.nativeElement;

    if (activeTabElement) {
      const width = activeTabElement.offsetWidth + 'px';
      const offsetX = activeTabElement.offsetLeft + 'px';

      if (!loadAnimation) {
        this.renderer.setStyle(this.indicator().nativeElement, 'width', width);
        this.renderer.setStyle(this.indicator().nativeElement, 'transform', \`translateX(\${offsetX})\`);
        return;
      }

      const animation = this.animBuilder.build([
        animate('150ms ease', style({ width, transform: \`translateX(\${offsetX})\` })),
      ]);

      const player = animation.create(this.indicator().nativeElement);
      player.play();
    }
  }
}
`,
  'switch': `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SwitchInputDirective, SwitchRootDirective, SwitchThumbDirective } from '@vacui-kit/primitives/switch';

@Component({
  selector: 'vac-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SwitchInputDirective, SwitchRootDirective, SwitchThumbDirective],
  template: \`
    <div class="flex items-center">
      <label class="pr-4 leading-none text-black" id="airplane-model-label" for="airplane-mode">Modus Aeroplanum</label>
      <button
        vacSwitchRoot
        name="custom-name"
        class="h-6 w-11 cursor-default rounded-full transition-colors data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-300"
        id="airplane-mode"
        aria-labelledby="airplane-mode-label"
      >
        <span class="sr-only">Modus Aeroplanum</span>
        <span
          vacSwitchThumb
          class="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-[1.5px] will-change-transform data-[state=checked]:translate-x-[21px]"
        ></span>
        <input *vacSwitchInput />
      </button>
    </div>
  \`,
})
export class SwitchComponent {
  checked = false;
}
`,
  'slider': `import { Component, Input } from '@angular/core';
import { SliderRootDirective, SliderInputDirective, SliderRangeDirective, SliderThumbDirective, SliderTrackDirective } from '@vacui-kit/primitives/slider';

@Component({
  selector: 'vac-slider',
  standalone: true,
  imports: [SliderRootDirective, SliderInputDirective, SliderRangeDirective, SliderThumbDirective, SliderTrackDirective],
  template: \`
    <span
      vacSliderRoot
      [min]="min"
      [max]="max"
      [step]="step"
      [value]="value"
      [orientation]="orientation"
      [inverted]="inverted"
      [minStepsBetweenThumbs]="minStepsBetweenThumbs"
      [disabled]="disabled"
      class="relative flex h-[18px] w-[300px] items-center rounded-full"
    >
      <span vacSliderTrack class="h-[3px] w-full bg-black/20 rounded-full">
        <span vacSliderRange class="bg-gray-900 rounded-full h-full"></span>
      </span>
      @for (item of value; track \$index) {
        <span
          vacSliderThumb
          class="h-5 w-5 rounded-full bg-gray-700 cursor-pointer focus:ring-4 focus:ring-black/40"
          aria-label="Volume"
        ></span>
      }
      <input vacSliderInput />
    </span>
  \`,
})
export class SliderComponent {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() minStepsBetweenThumbs = 5;
  @Input() disabled = false;
  @Input() value: number[] = [0];
  @Input() inverted = false;
  @Input() orientation: "horizontal" | "vertical" = 'horizontal';
}

@Component({
  selector: 'vac-vertical-slider',
  standalone: true,
  imports: [SliderRootDirective, SliderInputDirective, SliderRangeDirective, SliderThumbDirective, SliderTrackDirective],
  template: \`
    <span
      vacSliderRoot
      [min]="min"
      [max]="max"
      [step]="step"
      [value]="value"
      [orientation]="orientation"
      [disabled]="disabled"
      [inverted]="inverted"
      class="relative flex h-[200px] w-[10px] flex-col items-center rounded-full"
    >
      <span vacSliderTrack class="h-full w-[3px] bg-black/40 rounded-full">
        <span vacSliderRange class="w-full bg-gray-900 rounded-full h-full"></span>
      </span>
      @for (item of value; track \$index) {
        <span
          vacSliderThumb
          class="h-5 w-5 rounded-full bg-gray-700 cursor-pointer focus:ring-4 focus:ring-black/40"
          aria-label="Volume"
        ></span>
      }
      <input vacSliderInput />
    </span>
  \`,
})
export class VerticalSliderComponent {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() disabled = false;
  @Input() inverted = false;
  @Input() orientation: "horizontal" | "vertical" = 'vertical';
  @Input() value: number[] = [0];
}`,
  'separator': `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeparatorRootDirective } from '@vacui-kit/primitives/separator';

@Component({
  selector: 'vac-separator',
  standalone: true,
  imports: [SeparatorRootDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <h2 class="text-2xl font-semibold mb-3 text-gray-900">Vacui UI</h2>
      <p class="font-light mb-3 text-gray-600">Urbs aeterna</p>
      <div vacSeparatorRoot orientation="horizontal" class="w-full h-[1px] my-3 bg-gray-300"></div>
      <div class="flex items-center space-x-2">
        @for (item of items; track \$index) {
          <p class="font-medium text-lg text-gray-800">{{ item }}</p>
          @if (\$index !== items.length - 1) {
            <div vacSeparatorRoot orientation="vertical" class="h-5 w-[1px] bg-gray-300"></div>
          }
        }
      </div>
    </div>
  \`,
  styles: [],
})
export class SeparatorComponent {
  items = ['Caesar', 'Augustus', 'Trajan'];
}
`,
  'select': `import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroChevronUpDown } from '@ng-icons/heroicons/outline';
import { SelectItemComponent } from './select-item.component';
import { PortalDirective } from '@vacui-kit/primitives/portal';
import {
  SelectCompareWith,
  SelectContentDirective,
  SelectGroupDirective,
  SelectGroupLabelDirective,
  SelectRootDirective,
  SelectSeparatorDirective,
  SelectTriggerDirective,
  SelectValueDirective,
  SelectViewportDirective,
  SelectVisibilityDirective,
} from '@vacui-kit/primitives/select';

@Component({
  selector: 'vac-select-test',
  standalone: true,
  imports: [
    CommonModule,
    SelectContentDirective,
    SelectGroupDirective,
    SelectGroupLabelDirective,
    SelectRootDirective,
    SelectSeparatorDirective,
    SelectTriggerDirective,
    SelectValueDirective,
    SelectViewportDirective,
    SelectVisibilityDirective,
    PortalDirective,
    SelectItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroChevronUpDown })],
  template: \`
    <div class="flex justify-center mx-auto">
      <div
        vacSelectRoot
        #root="vacSelectRoot"
        name="select-name"
        [open]="false"
        [disabled]="false"
        class="relative w-80"
        (valueChange)="valueChange(\$event)"
        (openChange)="openChange(\$event)"
        [compareWith]="compareWith"
      >
        <button
          vacSelectTrigger
          class="relative w-full cursor-default rounded-md bg-white h-9 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
          aria-label="Food"
        >
          <div vacSelectValue class="truncate" placeholder="Placeholder"></div>
        </button>
        <ng-container *vacPortal>
          <div *vacSelectVisibility>
            <div
              vacSelectContent
              class="absolute w-80 mt-1 rounded-md bg-white shadow-lg z-10"
            >
              <div vacSelectViewport class="py-1 text-sm text-gray-700">
                <div vacSelectGroup>
                  <div vacSelectGroupLabel class="px-4 py-2 text-xs text-gray-500">
                    Grupo 1
                  </div>
                  <vac-select-item value="value1" label="Item 1">Item 1</vac-select-item>
                  <vac-select-item
                    value="value2"
                    label="Item 2"
                    [disabled]="true"
                    >Item 2</vac-select-item
                  >
                </div>
                <div vacSelectSeparator class="h-px bg-gray-200"></div>
                <div vacSelectGroup>
                  <div vacSelectGroupLabel class="px-4 py-2 text-xs text-gray-500">
                    Grupo 2
                  </div>
                  <vac-select-item value="value3" label="Item 3">Item 3</vac-select-item>
                  <vac-select-item value="value4" label="Item 3">Item 4</vac-select-item>
                  <vac-select-item value="value5" label="Item 3">Item 5</vac-select-item>
                  <vac-select-item value="value6" label="Item 3">Item 6</vac-select-item>
                  <vac-select-item value="value7" label="Item 3">Item 7</vac-select-item>
                  <vac-select-item value="value8" label="Item 3">Item 8</vac-select-item>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  \`,
})
export class SelectComponent {
  compareWith: SelectCompareWith<string> = (v1, v2) => {
    return v1?.[5] === v2?.[5];
  };

  valueChange(value: string | string[] | null) {
    console.log(value);
  }
  openChange(status: boolean) {
    console.log('OPEN/CLOSED: ', status);
  }
}
`,
  'selectItem': `import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck } from '@ng-icons/heroicons/outline';
import {
  SelectItemDirective,
  SelectItemIndicatorDirective,
  SelectItemTextDirective,
} from '@vacui-kit/primitives/select';

@Component({
  selector: 'vac-select-item',
  standalone: true,
  imports: [
    CommonModule,
    SelectItemDirective,
    NgIconComponent,
    SelectItemIndicatorDirective,
    SelectItemTextDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroCheck })],
  template: \`
    <div
      vacSelectItem
      class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 data-[highlighted]:bg-indigo-400 data-[highlighted]:text-white"
      [value]="value"
      [disabled]="disabled"
    >
      <span vacSelectItemText class="block truncate">
        <ng-content></ng-content>
      </span>
      <span
        *vacSelectItemIndicator
        class="absolute inset-y-0 right-0 flex items-center pr-4 text-lg"
      >
        <ng-icon name="heroCheck"></ng-icon>
      </span>
    </div>
  \`,
})
export class SelectItemComponent {
  @Input() value!: string;
  @Input() label!: string;
  @Input() disabled = false;
}
`,
  'radioGroup': `import { Component, Input } from '@angular/core';
import { RadioGroupRootDirective, RadioGroupItemDirective, RadioGroupInputDirective, RadioGroupIndicatorDirective } from '@vacui-kit/primitives/radio-group';

@Component({
  selector: 'vac-radio-item',
  standalone: true,
  imports: [RadioGroupItemDirective, RadioGroupInputDirective, RadioGroupIndicatorDirective],
  template: \`
    <div class="flex items-center space-x-2 relative">
      <button
        vacRadioGroupItem
        [value]="value"
        [disabled]="disabled"
        [attr.aria-labelledby]="value + '-label'"
        [id]="value"
        class="w-4 h-4 rounded-full border flex items-center justify-center data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=unchecked]:border-gray-400"
      >
        <span vacRadioGroupIndicator class="w-2 h-2 rounded-full bg-white"></span>
      </button>
      <input [value]="value" vacRadioGroupInput />
      <label [for]="value" [id]="value + '-label'">{{ label }}</label>
    </div>
  \`,
})
export class RadioItemComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Input() disabled = false;
}

@Component({
  selector: 'vac-radio-group',
  standalone: true,
  imports: [RadioGroupRootDirective, RadioItemComponent],
  template: \`
    <form>
      <div
        vacRadioGroupRoot
        name="toggleGroup"
        aria-label="View density"
        class="space-y-2"
        [(value)]="radioValue"
      >
        @for (option of options; track \$index) {
          <vac-radio-item
            [label]="option.label"
            [value]="option.value"
            [disabled]="option.disabled"
          ></vac-radio-item>
        }
      </div>
    </form>
  \`,
  styles: [],
})
export class RadioGroupComponent {
  radioValue = 'option2';
  groupName = 'radioGroup';
  options = [
    { label: 'Option 1', value: 'option1', disabled: false },
    { label: 'Option 2', value: 'option2', disabled: false },
    { label: 'Option 3', value: 'option3', disabled: false },
  ];
}
`,
  'progress': `import { ChangeDetectionStrategy, Component, OnDestroy, NgZone, ChangeDetectorRef, afterNextRender, computed, signal, OnInit } from '@angular/core';
import { ProgressRootDirective, ProgressIndicatorDirective } from '@vacui-kit/primitives/progress';

@Component({
  selector: 'vac-progress',
  standalone: true,
  imports: [ProgressRootDirective, ProgressIndicatorDirective],
  template: \`
    <div
      vacProgressRoot
      [value]="value()"
      [max]="max()"
      aria-label="Progress Status"
      class="relative h-6 w-72 overflow-hidden rounded-full bg-gray-300"
    >
      <div
        [style.transform]="translateX()"
        vacProgressIndicator
        class="h-full w-full bg-gray-800 transition-transform duration-300 ease-out"
      ></div>
    </div>
  \`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressComponent implements OnInit, OnDestroy {
  value = signal(0);
  max = signal(100);
  protected translateX = computed(() => \`translateX(-\${100 - (100 * this.value()) / this.max()}%)\`);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      if (this.value() < this.max()) {
        this.value.update(prevValue => (Math.min(prevValue + 1, this.max())));
      } else {
        this.stopProgress();
      }
    }, 100);
  }

  private stopProgress(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    this.stopProgress();
  }
}
`,
  'label': `import { Component } from '@angular/core';
import { LabelRootDirective } from '@vacui-kit/primitives/label';

@Component({
  selector: 'vac-label',
  standalone: true,
  imports: [LabelRootDirective],
  template: \`
    <div>
      <label
        vacLabelRoot
        for="testInput"
        class="block text-sm font-medium leading-6 text-gray-900"
      >
        Test Label
      </label>
      <input
        id="testInput"
        type="text"
        class="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
      />
    </div>
  \`
})
export class LabelComponent {}
`,
  'keyboardNavigation': `import { Component } from '@angular/core';
import { KeyNavigationRootDirective, KeyNavigationItemDirective } from '@vacui-kit/primitives/key-navigation';

@Component({
  selector: 'vac-keyboard',
  standalone: true,
  imports: [KeyNavigationRootDirective, KeyNavigationItemDirective],
  template: \`
    <div
      class="p-4 space-y-2 bg-gray-50 rounded"
      vacKeyNavigationRoot
      direction="vertical"
      [tabNavigation]="false"
      [rememberLastFocus]="true"
    >
      @for (item of items; track item.text) {
        <button
          class="w-full py-2 px-4 bg-white text-gray-800 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          vacKeyNavigationItem
          [disabled]="item.disabled"
          [startFocus]="item.startFocus"
        >
          {{ item.text }}
        </button>
      }
    </div>
  \`,
})
export class KeyboardNavigationComponent {
  items = [
    { text: 'Item 1', disabled: false, startFocus: false },
    { text: 'Item 2', disabled: true, startFocus: false },
    { text: 'Item 3', disabled: false, startFocus: false },
  ];
}
`,
  'dialog': `import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PortalDirective } from '@vacui-kit/primitives/portal';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  DialogRootDirective,
  DialogCloseDirective,
  DialogContentDirective,
  DialogDescriptionDirective,
  DialogOverlayDirective,
  DialogTitleDirective,
  DialogTriggerDirective,
} from '@vacui-kit/primitives/dialog';

@Component({
  selector: 'vac-dialog',
  standalone: true,
    imports: [
    DialogRootDirective,
    DialogCloseDirective,
    DialogContentDirective,
    DialogDescriptionDirective,
    DialogOverlayDirective,
    DialogTitleDirective,
    DialogTriggerDirective,
    PortalDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>
  <div vacDialogRoot>
    <button vacDialogTrigger class="bg-blue-500 text-white py-2 px-4 rounded">Open Parent Dialog</button>
    <ng-container *vacPortal>
      <div *vacDialogOverlay class="fixed inset-0 bg-black bg-opacity-50" [@overlay]></div>
      <div
        *vacDialogContent
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-96"
        [@content]
      >
        <h2 vacDialogTitle class="text-2xl font-bold mb-4">Parent Dialog</h2>
        <p vacDialogDescription class="mb-4">This is the parent dialog content.</p>
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="mt-2">
            <input
              class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <!-- Nested dialog -->
        <div vacDialogRoot class="mt-4">
          <button vacDialogTrigger class="bg-green-500 text-white py-2 px-4 rounded">Open Child Dialog</button>
          <ng-container *vacPortal>
            <div *vacDialogOverlay class="fixed inset-0 bg-black bg-opacity-50" [@overlay]></div>
            <div
              *vacDialogContent
              class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-80"
              [@content]
            >
              <h2 vacDialogTitle class="text-xl font-bold mb-4">Child Dialog</h2>
              <p vacDialogDescription class="mb-4">This is the child dialog content.</p>
              <button vacDialogClose aria-label="close" class="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded">Close Child Dialog</button>
            </div>
          </ng-container>
        </div>
        
        <button vacDialogClose aria-label="close" class="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded">Close Parent Dialog</button>
      </div>
    </ng-container>
  </div>
</div>
  \`,
  animations: [
    trigger('overlay', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [style({ opacity: 0 }), animate('150ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('100ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('content', [
      state('void', style({ opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'translate(-50%, -50%) scale(1)' })),
      ])
    ]),
  ],
})
export class DialogComponent {}
`,
  'collapsible': `import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroChevronUp } from '@ng-icons/heroicons/outline';
import { CollapsibleRootDirective, CollapsibleTriggerDirective, CollapsibleContentDirective } from '@vacui-kit/primitives/collapsible';

@Component({
  selector: 'vac-collapsible',
  standalone: true,
  imports: [CollapsibleRootDirective, CollapsibleTriggerDirective, CollapsibleContentDirective, NgIconComponent],
  viewProviders: [provideIcons({ heroChevronDown, heroChevronUp })],
  template: \`
    <div
      vacCollapsibleRoot
      [(open)]="open"
      [disabled]="disabled"
      class="not-prose max-w-md mx-auto transition-all ease-in-out duration-300 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
    >
      <div class="flex items-center justify-between p-4 bg-orange-600 text-white">
        <h3 class="text-lg font-semibold">
          Historical Event: Julius Caesar crosses the Rubicon
        </h3>
        <button
          vacCollapsibleTrigger
          aria-label="Toggle details"
          class="flex items-center justify-center p-2 rounded-full bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <ng-icon [name]="open ? 'heroChevronUp' : 'heroChevronDown'" class="h-5 w-5"></ng-icon>
        </button>
      </div>
      <div vacCollapsibleContent [@contentAnimation]="open ? 'show' : 'hide'" class="text-sm leading-6 text-gray-700">
        <p class="p-4 border-t border-gray-200">
          The crossing of the Rubicon was a pivotal event that led Julius Caesar to march into Rome and seize power, marking the start of civil war and the eventual rise of the Roman Empire.
        </p>
        <div class="p-4 border-t border-gray-200">
          <h4 class="font-medium text-gray-900">Key Moments:</h4>
          <ul class="mt-2 pl-4 list-disc list-inside text-orange-600">
            <li>Battle of Actium</li>
            <li>Foundation of Rome</li>
            <li>Roman Senate in session</li>
          </ul>
        </div>
      </div>
    </div>
  \`,
  animations: [
    trigger('contentAnimation', [
      state('hide', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('show', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('show <=> hide', animate('200ms ease-in-out')),
    ]),
  ],
})
export class CollapsibleComponent {
  @Input() open = false;
  @Input() disabled = false;
}
`,
  'checkbox': `import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck, heroMinus } from '@ng-icons/heroicons/outline';
import { CheckboxRootDirective, CheckboxInputDirective } from '@vacui-kit/primitives/checkbox';

@Component({
  selector: 'vac-checkbox',
  standalone: true,
  imports: [CheckboxRootDirective, CheckboxInputDirective, NgIconComponent],
  viewProviders: [provideIcons({ heroCheck, heroMinus })],
  template: \`
    <div class="flex items-center space-x-2">
      <button
        vacCheckboxRoot
        #check="vacCheckboxRoot"
        class="w-5 h-5 border border-gray-500 rounded flex items-center justify-center cursor-pointer transition-colors duration-200 ease-in-out hover:border-orange-500 hover:text-orange-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-0 data-[disabled]:cursor-not-allowed data-[disabled]:hover:text-current data-[disabled]:hover:border-gray-400"
        [class.bg-gray-500]="check.state.disabled() && check.state.checked() === true"
        [checked]="checked()"
        [disabled]="disabled()"
        aria-label="Toggle feature"
        id="checkbox"
      >
        @if (check.state.checked() === true) {
          <ng-icon class="w-4 h-4 text-white" name="heroCheck"></ng-icon>
        } @else if (check.state.checked() === 'indeterminate') {
          <ng-icon class="w-4 h-4" name="heroMinus"></ng-icon>
        }

        <input vacCheckboxInput />
      </button>

      <label for="checkbox" class="pl-2 leading-none">
        {{ label() }}
      </label>
    </div>
  \`,
})
export class CheckboxComponent {
  checked = input<boolean | 'indeterminate'>('indeterminate');
  disabled = input(false);
  label = input<string>('Accept terms and conditions.');
}
`,
  'avatar': `import { Component } from '@angular/core';
import { AvatarRootDirective, AvatarImageDirective, AvatarFallbackDirective } from '@vacui-kit/primitives/avatar';

@Component({
  selector: 'vac-avatar',
  standalone: true,
  imports: [AvatarRootDirective, AvatarImageDirective, AvatarFallbackDirective],
  template: \`
    <div class="not-prose flex justify-center space-x-4 p-4">
      <!-- Successful loading of an image -->
      <div
        vacAvatarRoot
          class="relative flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full shadow-lg overflow-hidden"
      >
        <img
          vacAvatarImage
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
          alt="Wikipedia"
          class="w-full h-full object-cover rounded-full"
        />
        <div
          *vacAvatarFallback="0"
          class="absolute inset-0 bg-orange-200 text-orange-700 flex items-center justify-center text-lg font-bold rounded-full"
        >
          WP
        </div>
      </div>

      <!-- Successful loading of an image with delayMs -->
      <div
        vacAvatarRoot
        class="relative flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full shadow-lg overflow-hidden"
      >
        <img
          vacAvatarImage
          src="https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=200&q=60"
          alt="Wikipedia"
          class="w-full h-full object-cover rounded-full"
          (loadingStatusChange)="onLoadingStatusChange(\$event)"
        />
        <div
          *vacAvatarFallback="1000"
          class="absolute inset-0 bg-orange-200 text-orange-700 flex items-center justify-center text-lg font-bold rounded-full"
        >
          WP
        </div>
      </div>

      <!-- I'm trying to load an image but it gives error -->
      <div
        vacAvatarRoot
        class="relative flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full shadow-lg overflow-hidden"
      >
        <img
          vacAvatarImage
          src="https://invalidurl.invalid"
          alt="Invalid"
          class="w-full h-full object-cover rounded-full"
        />
        <div
          *vacAvatarFallback="1500"
          class="absolute inset-0 bg-orange-200 text-orange-700 flex items-center justify-center text-lg font-bold rounded-full"
        >
          IV
        </div>
      </div>

      <!-- Image source is not provided and initials are shown -->
      <div
        vacAvatarRoot
        class="relative flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full shadow-lg overflow-hidden"
      >
        <div
          *vacAvatarFallback
          class="absolute inset-0 bg-orange-200 text-orange-700 flex items-center justify-center text-lg font-bold rounded-full"
        >
          EM
        </div>
      </div>
    </div>
  \`,
})
export class AvatarComponent {
  onLoadingStatusChange(status: string) {
    console.log(status);
  }
}
`,
  'aspectRatio': `import { Component, input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { AspectRatioRootDirective } from '@vacui-kit/primitives/aspect-ratio';

@Component({
  selector: 'vac-aspect-ratio',
  standalone: true,
  imports: [AspectRatioRootDirective, NgStyle],
  template: \`
    <div class="not-prose w-60 rounded-md overflow-hidden shadow-lg">
      <div
        [vacAspectRatio]="ratio()"
        #aspectRatio="vacAspectRatio"
        class="w-60 rounded-md overflow-hidden shadow-lg"
      >
        <div [ngStyle]="aspectRatio.contentStyle">
          <img
            class="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1592725220707-26006819c3ef?q=80&w=640"
            alt="Roman ruines photography by Luca Tosoni"
          />
        </div>
      </div>
    </div>
  \`,
})
export class AspectRatioComponent {
  ratio = input(16/9);
}
`,
  'accordion': `import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMinus, heroPlus } from '@ng-icons/heroicons/outline';
import { AccordionContentDirective, AccordionHeaderDirective, AccordionItemDirective, AccordionRootDirective, AccordionTriggerDirective } from '@vacui-kit/primitives/accordion';

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  open?: boolean;
}

@Component({
  selector: 'vac-accordion',
  standalone: true,
  imports: [AccordionContentDirective, AccordionHeaderDirective, AccordionItemDirective, AccordionRootDirective, AccordionTriggerDirective, NgIconComponent],
  viewProviders: [provideIcons({ heroMinus, heroPlus })],
  template: \`
    <div
      vacAccordionRoot
      [multiple]="multiple()"
      [value]="initialOpen()"
      [collapsible]="collapsible()"
      [disabled]="disabled()"
      [orientation]="orientation()"
      (valueChange)="valueChange(\$event)"
      class="flex flex-col not-prose"
    >
      @for (accordion of items(); track accordion.id) {
      <div
        vacAccordionItem
        #item="vacAccordionItem"
        [value]="accordion.id"
        [disabled]="false"
        class="overflow-hidden transition-colors border-t border-x border-gray-300 last:border-b first:rounded-t-xl last:rounded-b-xl focus-within:relative focus-within:z-10 focus-within:ring focus:ring-1 focus-within:ring-gray-300/50"
      >
        <p vacAccordionHeader="2" class="flex m-0">
          <button
            vacAccordionTrigger
            class="flex h-12 flex-1 cursor-pointer items-center justify-between bg-white text-lg px-4 font-medium leading-none text-gray-900 transition-colors hover:bg-opacity-95 focus:outline-none"
          >
            {{ accordion.title }}
            <div class="p-0.5 border rounded-sm">
              <ng-icon
                [name]="
                  item.state.isActive(accordion.id) ? 'heroMinus' : 'heroPlus'
                "
                class="h-4 w-4"
              ></ng-icon>
            </div>
          </button>
        </p>
        <div
          vacAccordionContent
          class="bg-gray-100 shadow-inner text-gray-950 overflow-hidden"
          [@contentExpansion]="item.state.isActive(accordion.id)"
        >
          <div class="p-4 text-base">
            <p>{{ accordion.description }}</p>
          </div>
        </div>
      </div>
      }
    </div>
  \`,
  animations: [
    trigger('contentExpansion', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0' })),
      transition('false <=> true', [
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)'),
      ]),
    ]),
  ],
  styles: [],
})
export class AccordionComponent {
  initialOpen = input(['item-1']);
  multiple = input(true);
  collapsible = input(false);
  disabled = input(false);
  orientation = input<'horizontal' | 'vertical'>('vertical');
  items = input<AccordionItem[]>([
    {
      id: 'item-1',
      title: 'Why is it called Vacui UI?',
      description:
        'Vacui comes from Latin. It is the plural of Vacuus and it means void or emptiness. Making a reference to the headless system.',
    },
    {
      id: 'item-2',
      title: 'Why do we use directives?',
      description:
        'Directives are a powerful way to interact with the DOM. We want to give you the most flexible solution to create your own components.',
    },
    {
      id: 'item-3',
      title: 'What are you waiting for?',
      description: 'Start using Vacui or contact us for any help.',
    },
  ]);

  valueChange(value: string | string[] | null) {
    console.log(value);
  }
}
`,
};
