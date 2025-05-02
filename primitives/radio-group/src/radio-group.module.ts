import { NgModule } from '@angular/core';
import { RadioGroupRootDirective } from './directives/radio-group-root.directive';
import { RadioGroupItemDirective } from './directives/radio-group-item.directive';
import { RadioGroupIndicatorDirective } from './directives/radio-group-indicator.directive';
import { RadioGroupInputDirective } from './directives/radio-group-item-input.directive';

const directives = [
  RadioGroupRootDirective,
  RadioGroupItemDirective,
  RadioGroupIndicatorDirective,
  RadioGroupInputDirective,
];

@NgModule({
  imports: [...directives],
  exports: [...directives],
})
export class RadioGroupPrimitivesModule {}
