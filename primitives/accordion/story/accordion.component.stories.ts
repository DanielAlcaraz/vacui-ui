import { Meta, applicationConfig } from '@storybook/angular';
import { AccordionComponent } from './accordion.component';
import { provideAnimations } from '@angular/platform-browser/animations';

export default {
  title: 'Components/Accordion',
  component: AccordionComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  args: {
    multiple: false,
    initialOpen: ['item-1'],
    collapsible: true,
    disabled: false,
    orientation: 'vertical',
  },
  argTypes: {
    multiple: { type: 'boolean' },
    disabled: { type: 'boolean' },
    collapsible: { type: 'boolean' },
    initialOpen: { type: 'string' },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
  },
} as Meta<AccordionComponent>;

export const Accordion = {};
