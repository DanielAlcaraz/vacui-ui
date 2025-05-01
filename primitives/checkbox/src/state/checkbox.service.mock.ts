import { signal } from '@angular/core';
import { CheckboxValue } from '../models/checkbox.models';

// Jest mock for AvatarStateService
export const mockCheckboxStateService = () => {
  const checked = signal<CheckboxValue>(false);
  const disabled = signal(false);
  const required = signal(false);
  const name = signal(false);
  const value = signal(false);

  // Mock loadImage function
  const toggleChecked = jest.fn(() => {
    if (checked() === 'indeterminate' || !checked()) {
      checked.set(true);
    } else {
      checked.set(false);
    }
  });

  return {
    checked,
    disabled,
    required,
    name,
    value,
    toggleChecked,
  };
};
