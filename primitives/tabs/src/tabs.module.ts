import { NgModule } from '@angular/core';
import { TabsRootDirective } from './directives/tabs-root.directive';
import { TabsListDirective } from './directives/tabs-list.directive';
import { TabsTriggerDirective } from './directives/tabs-trigger.directive';
import { TabsContentDirective } from './directives/tabs-content.directive';

const directives = [
  TabsRootDirective,
  TabsListDirective,
  TabsTriggerDirective,
  TabsContentDirective,
];

@NgModule({
  imports: [...directives],
  exports: [...directives],
})
export class TabsPrimitivesModule {}
