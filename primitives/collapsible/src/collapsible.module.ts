import { NgModule } from '@angular/core';
import { CollapsibleRootDirective } from './directives/collapsible-root.directive';
import { CollapsibleTriggerDirective } from './directives/collapsible-trigger.directive';
import { CollapsibleContentDirective } from './directives/collapsible-content.directive';

@NgModule({
  imports: [
    CollapsibleRootDirective,
    CollapsibleTriggerDirective,
    CollapsibleContentDirective,
  ],
  exports: [
    CollapsibleRootDirective,
    CollapsibleTriggerDirective,
    CollapsibleContentDirective,
  ],
})
export class CollapsiblePrimitivesModule {}
