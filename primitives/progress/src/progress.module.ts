import { NgModule } from '@angular/core';
import { ProgressRootDirective } from './directives/progress-root.directive';
import { ProgressIndicatorDirective } from './directives/progress-indicator.directive';

const directives = [ProgressRootDirective, ProgressIndicatorDirective];

@NgModule({
  imports : [...directives],
  exports: [...directives],
})
export class ProgressPrimitivesModule {}
