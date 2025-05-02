import { Directive, Input, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormControlDirective } from './reactive-form-control.directive';

@Directive({
  selector: '[reactiveFormRoot]'
})
export class ReactiveFormRootDirective<T> implements AfterContentInit {

  @Input() formGroup!: FormGroup;
  @ContentChildren(ReactiveFormControlDirective) controls!: QueryList<FormControl<T>>;

  ngAfterContentInit(): void {
    if (!this.formGroup) {
      this.formGroup = new FormGroup({});
      this.controls.forEach(control => {
        this.formGroup.addControl('', control);
      });
    }
  }
}
