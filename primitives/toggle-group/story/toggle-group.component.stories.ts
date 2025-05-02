import { Meta } from '@storybook/angular';
import { ToggleGroupComponent } from './toggle-group.component';

export default {
  title: 'Components/Toggle Group',
  component: ToggleGroupComponent,
  tags: ['autodocs'],
  args: {
    value: 'italic',
    type: 'single',
    orientation: 'horizontal',
    disabled: false,
    rovingFocus: true,
    loop: false,
  },
} as Meta<ToggleGroupComponent>;

export const ToggleGroup = {};
