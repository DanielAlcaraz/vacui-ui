import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { TogglePrimitivesModule } from './toggle.module';

describe('TogglePrimitives', () => {
  const setupDirective = async ({
    pressed = false,
    disabled = false,
  }: { pressed?: boolean; disabled?: boolean } = {}) => {
    return await render(
      `
      <button vacToggleRoot [pressed]="pressed" [disabled]="disabled">
        <span>Toggle</span>
      </button>
    `,
      {
        imports: [TogglePrimitivesModule],
        componentProperties: { pressed, disabled },
      },
    );
  };

  it('should create an accessible toggle component', async () => {
    await setupDirective();
    expect(await axe(screen.getByRole('button'))).toHaveNoViolations();
  });

  it('should toggle the state when clicked', async () => {
    const user = userEvent.setup();
    await setupDirective();

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('data-state', 'off');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute('data-state', 'on');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should toggle the state when pressing Enter or Space key', async () => {
    const user = userEvent.setup();
    await setupDirective();

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('data-state', 'off');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    await user.tab();
    await user.keyboard('{Enter}');

    expect(toggleButton).toHaveAttribute('data-state', 'on');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard('{Space}');

    expect(toggleButton).toHaveAttribute('data-state', 'off');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('should not toggle the state when disabled', async () => {
    const user = userEvent.setup();
    await setupDirective({ disabled: true });

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('data-state', 'off');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
    expect(toggleButton).toHaveAttribute('data-disabled', '');

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute('data-state', 'off');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('should initialize the state based on the pressed input', async () => {
    await setupDirective({ pressed: true });

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toHaveAttribute('data-state', 'on');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
  });
});