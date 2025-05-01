import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck, heroMinus } from '@ng-icons/heroicons/outline';
import { CheckboxRootDirective, CheckboxInputDirective } from '@vacui-ui/primitives/checkbox/index';

@Component({
  selector: 'vac-checkbox',
  standalone: true,
  imports: [CheckboxRootDirective, CheckboxInputDirective, NgIconComponent],
  viewProviders: [provideIcons({ heroCheck, heroMinus })],
  template: `
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
  `,
})
export class CheckboxComponent {
  checked = input<boolean | 'indeterminate'>('indeterminate');
  disabled = input(false);
  label = input<string>('Accept terms and conditions.');
}
