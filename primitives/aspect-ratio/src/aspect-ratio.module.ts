import { NgModule } from '@angular/core';
import { AspectRatioRootDirective } from './directives/aspect-ratio-root.directive';

@NgModule({
  imports: [AspectRatioRootDirective],
  exports: [AspectRatioRootDirective],
})
export class AspectRatioPrimitivesModule {}
