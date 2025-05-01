import { CheckboxRootDirective } from './checkbox-root.directive';
import { mockCheckboxStateService } from '../state/checkbox.service.mock';
import { render, screen } from '@testing-library/angular';
import { CheckboxStateService } from '../state/checkbox.service';
import { CheckboxValue } from '../models/checkbox.models';
import { axe } from "jest-axe";
import userEvent from '@testing-library/user-event';

interface DirectiveConfig {
  checked: CheckboxValue;
  disabled: boolean;
  required: boolean;
  name: string;
  value: string;
}

const expectChecked = function (element: HTMLElement) {
  expect(element).toHaveAttribute('data-state', 'checked');
  expect(element).toHaveAttribute('aria-checked', 'true');
};

const expectIndeterminate = function (element: HTMLElement) {
  expect(element).toHaveAttribute('data-state', 'indeterminate');
  expect(element).toHaveAttribute('aria-checked', 'mixed');
};

const expectUnchecked = function (element: HTMLElement) {
  expect(element).toHaveAttribute('data-state', 'unchecked');
  expect(element).toHaveAttribute('aria-checked', 'false');
};

describe('CheckboxDirective', () => {
  let checkboxStateService: CheckboxStateService;
  const setupDirective = async (config: Partial<DirectiveConfig> = {}) => {
    checkboxStateService = mockCheckboxStateService() as unknown as CheckboxStateService;
    checkboxStateService.checked.set('indeterminate');

    return await render(
      '<button vacCheckboxRoot [checked]="checked" [disabled]="disabled" [required]="required" [name]="name" [value]="value">BTN</button>',
      {
        imports: [CheckboxRootDirective],
        componentProperties: { ...config },
        providers: [{ provide: CheckboxStateService, useValue: checkboxStateService }],
      },
    );
  };

  it('should create a default checkbox', async () => {
    await setupDirective();
    const element = screen.queryByText('BTN')!;
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('data-state', 'indeterminate');
    expect(element).not.toHaveAttribute('data-disabled');
    expect(await axe(element)).toHaveNoViolations();
  });

  it('should reflect checked state', async () => {
    await setupDirective({ checked: true });

    const checkboxButton = screen.queryByText('BTN')!;
    expectChecked(checkboxButton);
  });

  it('should reflect uncheked state', async () => {
    await setupDirective({ checked: false });
    const checkboxButton = screen.queryByText('BTN')!;
    expectUnchecked(checkboxButton);
  });

  it('should reflect indeterminate state', async () => {
    await setupDirective({ checked: 'indeterminate' });
    const checkboxButton = screen.queryByText('BTN')!;
    expectIndeterminate(checkboxButton);
  });

  describe('when pressing space in default checkbox', () => {
    it('should reflect the checked state', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const checkboxButton = screen.queryByText('BTN')!;
      checkboxButton.focus();
      await user.keyboard(' ');
      expectChecked(checkboxButton);
    });
  });

  describe('when clicking a default checkbox', () => {
    it('should reflect the checked state', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const element = screen.queryByText('BTN')!;
      await user.click(element);
      expectChecked(element);
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('should be unchecked after double click', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const element = screen.queryByText('BTN')!;
      // Indeterminate -> Checked -> Unchecked
      await user.dblClick(element);
      expectUnchecked(element);
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('should reflect checked state after unchecked', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const element = screen.queryByText('BTN')!;
      // Indeterminate -> Checked -> Unchecked
      await user.dblClick(element);
      // Checked
      await user.click(element);
      expectChecked(element);
      expect(element).not.toHaveAttribute('data-disabled');
    });
  });

  describe('when disable a checkbox', () => {
    it('should not allow to toggle the state', async () => {
      const user = userEvent.setup();
      await setupDirective({ disabled: true });
      const element = screen.queryByText('BTN')!;
      await user.click(element);
      expectIndeterminate(element);
      expect(element).toHaveAttribute('data-disabled', '');
    });
  });
});
