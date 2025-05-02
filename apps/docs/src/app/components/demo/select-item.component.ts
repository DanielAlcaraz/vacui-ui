import { CommonModule } from '@angular/common';
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
  template: `
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
  `,
})
export class SelectItemComponent {
  @Input() value!: string;
  @Input() label!: string;
  @Input() disabled = false;
}
