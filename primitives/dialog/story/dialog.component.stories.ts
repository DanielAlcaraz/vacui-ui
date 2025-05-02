import { Meta, applicationConfig } from '@storybook/angular';
import { DialogComponent } from './dialog.component';
import { provideAnimations } from '@angular/platform-browser/animations';

export default {
  title: 'Components/Dialog',
  component: DialogComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    })
  ],
  tags: ['autodocs'],
} as Meta<DialogComponent>;

export const Dialog = {};
