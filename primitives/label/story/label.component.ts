import { Component } from '@angular/core';
import { LabelRootDirective } from '../public-api';

@Component({
  selector: 'vacui-ui-label',
  standalone: true,
  imports: [LabelRootDirective],
  template: `
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
  `
})
export class LabelComponent {}
