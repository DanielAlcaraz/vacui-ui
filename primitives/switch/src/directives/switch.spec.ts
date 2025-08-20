import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { SwitchPrimitivesModule } from '../switch.module';
import userEvent from '@testing-library/user-event';

interface DirectiveConfig {
  checked: boolean;
  disabled: boolean;
  required: boolean;
  name: string;
  value: string;
  checkedChange: jest.Mock<any>;
}

describe('SwitchPrimitives', () => {
  const setupDirective = async ({
    checked = false,
    disabled = false,
    required = false,
    name = 'input-name',
    value = 'on',
    checkedChange = jest.fn(),
  }: Partial<DirectiveConfig> = {}) => {
    return await render(
      `
      <div data-testid="switch">
        <label for="airplane-mode">Modus Aeroplanum</label>
        <button vacSwitchRoot [(checked)]="checked" (checkedChange)="checkedChange($event)" id="airplane-mode" [name]="name" [value]="value" [disabled]="disabled" [required]="required">
          <span class="sr-only">Modus Aeroplanum</span>
          <div vacSwitchThumb></div>
          <input *vacSwitchInput data-testid="input" />
        </button>
      </div>
    `,
      {
        imports: [SwitchPrimitivesModule],
        componentProperties: { checked, disabled, required, name, value, checkedChange  },
      },
    );
  };

  it('should create an accessible switch', async () => {
    await setupDirective();
    expect(await axe(screen.getByTestId('switch'))).toHaveNoViolations();
  });

  it('should toggle the switch when clicked', async () => {
    const user = userEvent.setup();
    await setupDirective();
    const switchButton = screen.getByRole('switch');

    expect(switchButton).not.toBeChecked();
    await user.click(switchButton);
    expect(switchButton).toBeChecked();
  });

  it('should toggle the switch when pressing space or enter key', async () => {
    const user = userEvent.setup();
    await setupDirective();
    const switchButton = screen.getByRole('switch');
    expect(switchButton).not.toBeChecked();
    await user.tab();
    await user.keyboard('{Space}');
    expect(switchButton).toBeChecked();

    await user.keyboard('{Enter}');
    expect(switchButton).not.toBeChecked();
  });

  it('should not toggle the switch when disabled', async () => {
    const user = userEvent.setup();
    await setupDirective({ disabled: true });
    const switchButton = screen.getByRole('switch');

    expect(switchButton).not.toBeChecked();
    await user.click(switchButton);
    expect(switchButton).not.toBeChecked();
    await user.keyboard('{Enter}');
    expect(switchButton).not.toBeChecked();
  });

  it('should have the correct name attribute', async () => {
    const name = 'my-switch';
    await setupDirective({ name });
    const inputElement = screen.getByTestId('input');

    expect(inputElement).toHaveAttribute('name', name);
  });

  it('should have the correct value attribute', async () => {
    const value = 'switch-value';
    await setupDirective({ value, name: "switch" });
    const inputElement = screen.getByTestId('input');

    expect(inputElement).toHaveAttribute('value', value);
  });

  it('should have the correct required attribute', async () => {
    await setupDirective({ required: true });
    const switchButton = screen.getByRole('switch');

    expect(switchButton).toHaveAttribute('aria-required', 'true');
  });

  it('should emit a value when value changes', async() => {
    const user = userEvent.setup();
    const checkedChange = jest.fn();
    await setupDirective({ checkedChange });
    await user.click(screen.getByRole('switch'));
    expect(checkedChange).toHaveBeenCalledWith(true);
  })
});
