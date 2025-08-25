import { Directive, OnDestroy, OnInit, inject } from '@angular/core';
import { ControlRoot } from './control.root.model';
import { ControlValueAccessor } from '@angular/forms';
import { CONTROL_ROOT_TOKEN } from './control-root.token';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[reactiveFormControl]',
})
export class ReactiveFormControlDirective<T>
  implements OnInit, OnDestroy, ControlValueAccessor
{
  private controlRoot = inject<ControlRoot<T>>(CONTROL_ROOT_TOKEN);

  private unsubscribe = new Subject<void>();
  private onChange!: (value: T) => void;
  private onTouched!: () => void;

  ngOnInit(): void {
    this.controlRoot.valueUpdated
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.onChange(value);
      });

    this.controlRoot.touched
      ?.pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.onTouched();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  writeValue(value: T): void {
    this.controlRoot.setValue(value);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.controlRoot.setDisabledState(isDisabled);
  }
}
