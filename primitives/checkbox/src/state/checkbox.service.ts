import { Injectable, signal } from '@angular/core';
import { CheckboxValue } from '../models/checkbox.models';

@Injectable()
export class CheckboxStateService {
  public checked = signal<CheckboxValue>(false);
  public disabled = signal(false);
  public required = signal(false);
  public name = signal('');
  public value = signal('on');

  public toggleChecked() {
    if (this.checked() === 'indeterminate' || !this.checked()) {
      this.checked.set(true)
    } else {
      this.checked.set(false);
    }
  }
}
