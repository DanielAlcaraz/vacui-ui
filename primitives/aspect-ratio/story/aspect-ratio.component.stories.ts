import { Meta } from '@storybook/angular';
import { AspectRatioComponent } from './aspect-ratio.component';

export default {
  title: 'Components/Aspect Ratio',
  component: AspectRatioComponent,
  tags: ['autodocs'],
  args: {
    numerator: 16,
    denominator: 9,
  },
  argTypes: {
    numerator: {
      type: 'number',
      control: { type: 'number' },
    },
    denominator: {
      type: 'number',
      control: { type: 'number' },
    },
  },
} as Meta<AspectRatioComponent>;

export const AspectRatio = (args: { numerator: number; denominator: number }) => ({
  component: AspectRatioComponent,
  props: {
    ratio: args.numerator / args.denominator,
  },
});
