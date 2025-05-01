import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

const helperModules = [
  ReactiveFormsModule,
];

@NgModule({
  imports: [...helperModules],
  exports: [...helperModules],
})
export class HelpersModule {}
