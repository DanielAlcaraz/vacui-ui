import { Meta } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';
import { signal } from '@angular/core';

export default {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  argTypes: {
    disabled: { type: 'boolean' },
    label: { type: 'string' }
  },
} as Meta<CheckboxComponent>;

export const Checkbox = {
  render: (args: CheckboxComponent) => ({
    props: args,
  }),
  args: {
    checked: 'indeterminate',
    disabled: false,
    label: 'Checkbox label'
  },
};
