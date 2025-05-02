import { NgModule } from '@angular/core';
import { LabelRootDirective } from './label.directive';

@NgModule({
  imports: [LabelRootDirective],
  exports: [LabelRootDirective],
})
export class LabelPrimitivesModule {}
