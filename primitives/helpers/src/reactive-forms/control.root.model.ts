import { EventEmitter } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ControlRoot<T = any> {
  setValue(value: T): void;
  getValue(): T;
  setDisabledState(isDisabled: boolean): void;
  valueUpdated: EventEmitter<T>;
  touched?: EventEmitter<T>;
}
