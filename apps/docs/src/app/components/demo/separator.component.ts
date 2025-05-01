import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeparatorRootDirective } from '@vacui-ui/primitives/separator';

@Component({
  selector: 'vac-separator',
  standalone: true,
  imports: [SeparatorRootDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <h2 class="text-2xl font-semibold mb-3 text-gray-900">Vacui UI</h2>
      <p class="font-light mb-3 text-gray-600">Urbs aeterna</p>
      <div vacSeparatorRoot orientation="horizontal" class="w-full h-[1px] my-3 bg-gray-300"></div>
      <div class="flex items-center space-x-2">
        @for (item of items; track $index) {
          <p class="font-medium text-lg text-gray-800">{{ item }}</p>
          @if ($index !== items.length - 1) {
            <div vacSeparatorRoot orientation="vertical" class="h-5 w-[1px] bg-gray-300"></div>
          }
        }
      </div>
    </div>
  `,
  styles: [],
})
export class SeparatorComponent {
  items = ['Caesar', 'Augustus', 'Trajan'];
}
