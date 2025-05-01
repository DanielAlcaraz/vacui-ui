import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxInputDirective } from './directives/checkbox-input.directive';
import { CheckboxRootDirective } from './directives/checkbox-root.directive';

@NgModule({
  imports: [CommonModule, CheckboxRootDirective, CheckboxInputDirective],
  exports: [CheckboxRootDirective, CheckboxInputDirective],
})
export class CheckboxPrimitivesModule {}
