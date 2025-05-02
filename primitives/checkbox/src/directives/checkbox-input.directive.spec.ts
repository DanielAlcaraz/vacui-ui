import { CheckboxRootDirective } from './checkbox-root.directive';
import { mockCheckboxStateService } from '../state/checkbox.service.mock';
import { render, screen } from '@testing-library/angular';
import { CheckboxStateService } from '../state/checkbox.service';
import { CheckboxValue } from '../models/checkbox.models';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { CheckboxInputDirective } from './checkbox-input.directive';

interface DirectiveConfig {
  checked: CheckboxValue;
  disabled: boolean;
  required: boolean;
  name: string;
  value: string;
}

describe('CheclboxInputDirective', () => {
  let checkboxStateService: CheckboxStateService;
  const setupDirective = async ({
    checked = 'indeterminate',
    disabled = false,
    name = '',
    required = false,
    value = 'on',
  }: Partial<DirectiveConfig> = {}) => {
    checkboxStateService = mockCheckboxStateService() as unknown as CheckboxStateService;
    checkboxStateService.checked.set(checked);

    return await render(
      `<button vacCheckboxRoot [checked]="checked" [disabled]="disabled" [required]="required" [name]="name" [value]="value">
        BTN
        <input data-testid="input" vacCheckboxInput />
      </button>`,
      {
        imports: [CheckboxRootDirective, CheckboxInputDirective],
        componentProperties: { checked, disabled, name, value, required },
        providers: [{ provide: CheckboxStateService, useValue: checkboxStateService }],
      },
    );
  };

  it('should create a default checkbox', async () => {
    await setupDirective();
    const element = screen.getByTestId('input')!;
    expect(element).not.toBeVisible();
    expect(element).toHaveAttribute('data-state', 'indeterminate');
    expect(element).toHaveAttribute('value', 'on');
    expect(element).toHaveAttribute('hidden');
    expect(element).not.toHaveAttribute('data-disabled');
    expect(await axe(element)).toHaveNoViolations();
  });

  it('should toggle checkbox property on button click', async () => {
    const { container } = await setupDirective({ checked: false });
    const button = container.querySelector('button')!;
    const input = screen.getByTestId('input')!;

    await userEvent.click(button);
    expect(input).toHaveProperty('checked', true);

    await userEvent.click(button);
    expect(input).toHaveProperty('checked', false);
  });

  it('should handle indeterminate state correctly', async () => {
    await setupDirective({ checked: 'indeterminate' });
    const input = screen.getByTestId<HTMLInputElement>('input');

    // Check if the input reflects indeterminate state
    expect(input.indeterminate).toBe(true);
    expect(input).toHaveAttribute('aria-checked', 'mixed');
    expect(input).toHaveAttribute('data-state', 'indeterminate');

    // Simulate user clicking the button to change state
    const button = screen.getByText('BTN');
    await userEvent.click(button);

    expect(input.indeterminate).toBe(false);
    expect(input.checked).toBe(true);
  });
});
