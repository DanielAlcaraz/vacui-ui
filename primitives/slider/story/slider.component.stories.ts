import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { SliderComponent, VerticalSliderComponent } from './slider.component';

export default {
  title: 'Components/Slider',
  component: SliderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SliderComponent, VerticalSliderComponent],
    }),
  ],
} as Meta<SliderComponent>;

type Story = StoryObj<SliderComponent>;

export const HorizontalSlider: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    orientation: 'horizontal',
    inverted: false,
  },
};

export const HorizontalSliderWithRange: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: [25],
    disabled: false,
    orientation: 'horizontal',
    inverted: false,
  },
};

export const HorizontalSliderInverted: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: [25],
    disabled: false,
    orientation: 'horizontal',
    inverted: true,
  },
};

export const HorizontalSliderWithThumbs: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: [25, 75],
    disabled: false,
    orientation: 'horizontal',
    inverted: false,
  },
};

export const VerticalSlider: Story = {
  render: (args) => ({
    props: args,
    template: `<vac-vertical-slider [inverted]="inverted" [min]="min" [max]="max" [step]="step" [value]="value" [disabled]="disabled" [orientation]="orientation"></vac-vertical-slider>`,
  }),
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: [0],
    disabled: false,
    orientation: 'vertical',
    inverted: false,
  },
};

export const VerticalSliderWithRange: Story = {
  render: (args) => ({
    props: args,
    template: `<vac-vertical-slider [inverted]="inverted" [min]="min" [max]="max" [step]="step" [value]="value" [disabled]="disabled" [orientation]="orientation"></vac-vertical-slider>`,
  }),
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: [25],
    disabled: false,
    orientation: 'vertical',
    inverted: false,
  },
};

export const VerticalSliderInverted: Story = {
  render: (args) => ({
    props: args,
    template: `<vac-vertical-slider [inverted]="inverted" [min]="min" [max]="max" [step]="step" [value]="value" [disabled]="disabled" [orientation]="orientation"></vac-vertical-slider>`,
  }),
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: [25],
    disabled: false,
    orientation: 'vertical',
    inverted: true,
  },
};

export const VerticalSliderWithThumbs: Story = {
  render: (args) => ({
    props: args,
    template: `<vac-vertical-slider [inverted]="inverted" [min]="min" [max]="max" [step]="step" [value]="value" [disabled]="disabled" [orientation]="orientation"></vac-vertical-slider>`,
  }),
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: [25, 75],
    disabled: false,
    orientation: 'vertical',
    inverted: false,
  },
};
