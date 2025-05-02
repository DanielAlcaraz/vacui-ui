import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular';
import { TooltipComponent } from './tooltip.component';
import { NoopAnimationsModule, provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    })
  ]
} as Meta<TooltipComponent>;

export const Tooltip = {};
