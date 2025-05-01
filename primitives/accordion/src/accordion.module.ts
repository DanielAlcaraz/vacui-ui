import { NgModule } from '@angular/core';
import { AccordionContentDirective } from './directives/accordion-content.directive';
import { AccordionHeaderDirective } from './directives/accordion-header.directive';
import { AccordionItemDirective } from './directives/accordion-item.directive';
import { AccordionRootDirective } from './directives/accordion-root.directive';
import { AccordionTriggerDirective } from './directives/accordion-trigger.directive';

@NgModule({
  imports: [
    AccordionRootDirective,
    AccordionItemDirective,
    AccordionTriggerDirective,
    AccordionContentDirective,
    AccordionHeaderDirective,
  ],
  exports: [
    AccordionRootDirective,
    AccordionItemDirective,
    AccordionTriggerDirective,
    AccordionContentDirective,
    AccordionHeaderDirective,
  ],
})
export class AccordionPrimitivesModule {}
