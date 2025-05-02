import { CommonModule } from '@angular/common';
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
  template: `
    <div class="flex justify-center mx-auto">
      <div
        vacSelectRoot
        #root="vacSelectRoot"
        name="select-name"
        [open]="false"
        [disabled]="false"
        class="relative w-80"
        (valueChange)="valueChange($event)"
        (openChange)="openChange($event)"
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
  `,
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
