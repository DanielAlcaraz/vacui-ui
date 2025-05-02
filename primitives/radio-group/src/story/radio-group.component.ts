import { Component, Input } from '@angular/core';
import { RadioGroupPrimitivesModule } from '../radio-group.module';

@Component({
  selector: 'app-radio-item',
  standalone: true,
  imports: [RadioGroupPrimitivesModule],
  template: `
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
  `,
})
export class RadioItemComponent {
  @Input() label!: string;
  @Input() value!: string;
  @Input() disabled = false;
}

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [RadioGroupPrimitivesModule, RadioItemComponent],
  template: `
    <form>
      <div
        vacRadioGroupRoot
        name="toggleGroup"
        aria-label="View density"
        class="space-y-2"
        [(value)]="radioValue"
      >
        @for (option of options; track $index) {
          <app-radio-item
            [label]="option.label"
            [value]="option.value"
            [disabled]="option.disabled"
          ></app-radio-item>
        }
      </div>
    </form>
  `,
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
