import { Meta } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';

export default {
  title: 'Components/Toggle',
  component: ToggleComponent,
  tags: ['autodocs'],
  args: {
    pressed: false,
    disabled: false,
  },
} as Meta<ToggleComponent>;

export const Toggle = {};
