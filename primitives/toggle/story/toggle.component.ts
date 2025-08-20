import { Component, input, model } from '@angular/core';
import { TogglePrimitivesModule } from '../src/toggle.module';

@Component({
  selector: 'vacui-ui-toggle',
  standalone: true,
  imports: [TogglePrimitivesModule],
  template: `
    <button
      vacToggleRoot
      [(pressed)]="pressed"
      [disabled]="disabled()"
      aria-label="Toggle notifications"
      class="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-gray-200 text-gray-600 hover:bg-gray-300 data-[state=on]:bg-indigo-600 data-[state=on]:text-white data-[state=on]:hover:bg-indigo-700 data-[disabled]:cursor-not-allowed"
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
  `
})
export class ToggleComponent {
  readonly pressed = model(false);
  readonly disabled = input(false);
}
