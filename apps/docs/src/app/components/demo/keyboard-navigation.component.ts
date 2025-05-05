import { Component } from '@angular/core';
import { KeyNavigationRootDirective, KeyNavigationItemDirective } from '@vacui-kit/primitives/key-navigation';

@Component({
  selector: 'vac-keyboard',
  standalone: true,
  imports: [KeyNavigationRootDirective, KeyNavigationItemDirective],
  template: `
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
  `,
})
export class KeyboardNavigationComponent {
  items = [
    { text: 'Item 1', disabled: false, startFocus: false },
    { text: 'Item 2', disabled: true, startFocus: false },
    { text: 'Item 3', disabled: false, startFocus: false },
  ];
}
