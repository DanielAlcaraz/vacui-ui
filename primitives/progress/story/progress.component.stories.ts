import { Meta, applicationConfig } from '@storybook/angular';
import { ProgressComponent } from './progress.component';
import { provideAnimations } from '@angular/platform-browser/animations';

export default {
  title: 'Components/Progress',
  component: ProgressComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
} as Meta<ProgressComponent>;

export const Progress = {};
