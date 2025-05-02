import { NgModule } from '@angular/core';
import { ArrowComponent } from './arrow/arrow.component';
import { TooltipArrowDirective } from './directives/tooltip-arrow.directive';
import { TooltipContentDirective } from './directives/tooltip-content.directive';
import { TooltipTriggerDirective } from './directives/tooltip-trigger.directive';
import { TooltipRootDirective } from './directives/tooltip-root.directive';

const directivesPrimitives = [
  TooltipRootDirective,
  TooltipTriggerDirective,
  TooltipContentDirective,
  TooltipArrowDirective,
];

@NgModule({
  imports: [...directivesPrimitives, ArrowComponent],
  exports: [...directivesPrimitives],
})
export class TooltipPrimitivesModule {}
