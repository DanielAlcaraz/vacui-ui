import { NgModule } from '@angular/core';
import { ToggleRootDirective } from './toggle-root.directive';

@NgModule({
  imports: [ToggleRootDirective],
  exports: [ToggleRootDirective],
})
export class TogglePrimitivesModule {}
