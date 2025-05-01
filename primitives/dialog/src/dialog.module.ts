import { NgModule } from '@angular/core';
import { DialogRootDirective } from './directives/dialog-root.directive';
import { DialogTriggerDirective } from './directives/dialog-trigger.directive';
import { DialogOverlayDirective } from './directives/dialog-overlay.directive';
import { DialogContentDirective } from './directives/dialog-content.directive';
import { DialogCloseDirective } from './directives/dialog-close.directive';
import { DialogTitleDirective } from './directives/dialog-title.directive';
import { DialogDescriptionDirective } from './directives/dialog-description.directive';

const directives = [
  DialogRootDirective,
  DialogTriggerDirective,
  DialogOverlayDirective,
  DialogContentDirective,
  DialogTitleDirective,
  DialogDescriptionDirective,
  DialogCloseDirective,
];

@NgModule({
  imports: [...directives],
  exports: [...directives],
})
export class DialogPrimitivesModule {}
