import { Meta, applicationConfig } from '@storybook/angular';
import { CollapsibleComponent } from './collapsible.component';
import { provideAnimations } from '@angular/platform-browser/animations';

export default {
  title: 'Components/Collapsible',
  component: CollapsibleComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  args: {
    open: false,
    disabled: false
  }
} as Meta<CollapsibleComponent>;

export const Collapsible = {};
