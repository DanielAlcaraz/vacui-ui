import { ElementRef, Injectable, WritableSignal, signal } from '@angular/core';
import { generateRandomId } from '@vacui-ui/primitives/utils';

@Injectable()
export class RadioGroupService {
  value = signal<string | null>(null);
  disabled = signal(false);
  name = signal<string>(generateRandomId());
  required = signal(false);
  radioItems = new Map<string, { disabled: WritableSignal<boolean>, elementRef: ElementRef }>();

  registerItem(value: string, disabled = false, elementRef: ElementRef): void {
    this.radioItems.set(value, { disabled: signal(disabled), elementRef });
  }

  unregisterItem(value: string): void {
    this.radioItems.delete(value);
  }
}
