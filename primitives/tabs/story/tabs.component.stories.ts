import { Meta, applicationConfig } from '@storybook/angular';
import { TabsComponent } from './tabs.component';
import { provideAnimations } from '@angular/platform-browser/animations';

export default {
  title: 'Components/Tabs',
  component: TabsComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
} as Meta<TabsComponent>;

export const Tabs = {};
