import { Directive, AfterContentInit, input, contentChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormControlDirective } from './reactive-form-control.directive';

@Directive({
  selector: '[reactiveFormRoot]'
})
export class ReactiveFormRootDirective<T> implements AfterContentInit {

  readonly formGroup = input.required<FormGroup>();
  readonly controls = contentChildren(ReactiveFormControlDirective);

  ngAfterContentInit(): void {
    if (!this.formGroup()) {
      this.formGroup = new FormGroup({});
      this.controls().forEach(control => {
        this.formGroup().addControl('', control);
      });
    }
  }
}
