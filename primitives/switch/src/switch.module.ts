import { NgModule } from '@angular/core';
import { SwitchRootDirective } from './directives/switch-root.directive';
import { SwitchInputDirective } from './directives/switch-input.directive';
import { SwitchThumbDirective } from './directives/switch-thumb.directive';

@NgModule({
  imports: [SwitchRootDirective, SwitchThumbDirective, SwitchInputDirective],
  exports: [SwitchRootDirective, SwitchThumbDirective, SwitchInputDirective],
})
export class SwitchPrimitivesModule {}
