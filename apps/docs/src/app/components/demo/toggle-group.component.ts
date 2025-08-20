import { NgClass } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { ToggleGroupItemDirective, ToggleGroupRootDirective } from '@vacui-kit/primitives/toggle-group';

@Component({
  selector: 'vac-toggle-group',
  standalone: true,
  imports: [ToggleGroupItemDirective, ToggleGroupRootDirective, NgClass],
  template: `
    <div
      vacToggleGroupRoot
      [attr.aria-label]="ariaLabel()"
      [type]="type()"
      [(value)]="value"
      [orientation]="orientation()"
      [disabled]="disabled()"
      [rovingFocus]="rovingFocus()"
      [loop]="loop()"
      class="flex"
      [ngClass]="{
        'flex-col': orientation() === 'vertical',
        'flex-row': orientation() === 'horizontal'
      }"
    >
      @for (item of toggleItems; track item.value; let i = $index) {
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
  `,
})
export class ToggleGroupComponent {
  readonly value = model<string | string[]>('');
  readonly type = input<'multiple' | 'single'>('single');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly disabled = input(false);
  readonly rovingFocus = input(true);
  readonly loop = input(false);
  readonly ariaLabel = input('Text style');

  toggleItems = [
    { value: 'bold', ariaLabel: 'Bold text' },
    { value: 'italic', ariaLabel: 'Italic text' },
    { value: 'underline', ariaLabel: 'Underline text' },
  ];

  getItemClass(index: number): string {
    const isFirst = index === 0;
    const isLast = index === this.toggleItems.length - 1;
    const isMiddle = !isFirst && !isLast;

    return `
      ${isFirst && this.orientation() === 'horizontal' ? 'rounded-l-md' : ''}
      ${isFirst && this.orientation() === 'vertical' ? 'rounded-t-md' : ''}
      ${isLast && this.orientation() === 'horizontal' ? 'rounded-r-md' : ''}
      ${isLast && this.orientation() === 'vertical' ? 'rounded-b-md' : ''}
      ${isMiddle && this.orientation() === 'horizontal' ? 'border-l-0 border-r-0' : ''}
      ${isMiddle && this.orientation() === 'vertical' ? 'border-t-0 border-b-0' : ''}
    `;
  }
}
