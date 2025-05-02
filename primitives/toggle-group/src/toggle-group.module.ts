import { NgModule } from '@angular/core';
import { ToggleGroupRootDirective } from './directives/toggle-group-root.directive';
import { ToggleGroupItemDirective } from './directives/toggle-group-item.directive';

@NgModule({
  imports: [ToggleGroupRootDirective, ToggleGroupItemDirective],
  exports: [ToggleGroupRootDirective, ToggleGroupItemDirective],
})
export class ToggleGroupPrimitivesModule {}
