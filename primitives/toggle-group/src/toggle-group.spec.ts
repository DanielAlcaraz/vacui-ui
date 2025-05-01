import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { ToggleGroupPrimitivesModule } from './toggle-group.module';

describe('ToggleGroupPrimitives', () => {
  const setupDirective = async ({
    value = '',
    type = 'single',
    orientation = 'horizontal',
    disabled = false,
    rovingFocus = true,
    loop = false,
  }: {
    value?: string | string[];
    type?: 'multiple' | 'single';
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    rovingFocus?: boolean;
    loop?: boolean;
  } = {}) => {
    return await render(
      `
      <div
        vacToggleGroupRoot
        aria-label="Text style"
        [type]="type"
        [(value)]="value"
        [disabled]="disabled"
        [rovingFocus]="rovingFocus"
        [orientation]="orientation"
        [loop]="loop"
      >
        <button vacToggleGroupItem value="a" aria-label="Left aligned">A</button>
        <button vacToggleGroupItem value="b" aria-label="Center aligned">B</button>
        <button vacToggleGroupItem value="c" aria-label="Right aligned">C</button>
      </div>
    `,
      {
        imports: [ToggleGroupPrimitivesModule],
        componentProperties: { value, type, orientation, disabled, rovingFocus, loop },
      },
    );
  };

  describe('when checking accessibility', () => {
    it('should create an accessible toggle group component', async () => {
      await setupDirective();
      expect(await axe(screen.getByRole('group'))).toHaveNoViolations();
    });
  });

  describe('when user toggles the state', () => {
    it('should toggle the state of a single item when clicked', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const toggleButton = screen.getByLabelText('Left aligned');
      expect(toggleButton).toHaveAttribute('data-state', 'off');
      expect(toggleButton).toHaveAttribute('aria-checked', 'false');
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('data-state', 'on');
      expect(toggleButton).toHaveAttribute('aria-checked', 'true');
    });

    it('should toggle the state of multiple items when clicked', async () => {
      const user = userEvent.setup();
      await setupDirective({ type: 'multiple' });
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonB = screen.getByLabelText('Center aligned');
      expect(toggleButtonA).toHaveAttribute('data-state', 'off');
      expect(toggleButtonA).toHaveAttribute('aria-pressed', 'false');
      expect(toggleButtonB).toHaveAttribute('data-state', 'off');
      expect(toggleButtonB).toHaveAttribute('aria-pressed', 'false');
      await user.click(toggleButtonA);
      await user.click(toggleButtonB);
      expect(toggleButtonA).toHaveAttribute('data-state', 'on');
      expect(toggleButtonA).toHaveAttribute('aria-pressed', 'true');
      expect(toggleButtonB).toHaveAttribute('data-state', 'on');
      expect(toggleButtonB).toHaveAttribute('aria-pressed', 'true');
    });

    it('should not toggle the state when disabled', async () => {
      const user = userEvent.setup();
      await setupDirective({ disabled: true });
      const toggleButton = screen.getByLabelText('Left aligned');
      expect(toggleButton).toHaveAttribute('data-state', 'off');
      expect(toggleButton).toHaveAttribute('aria-checked', 'false');
      expect(toggleButton).toHaveAttribute('data-disabled', 'true');
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('data-state', 'off');
      expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('when user navigates with the keyboard', () => {
    it('should handle roving focus', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonB = screen.getByLabelText('Center aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      await user.tab();
      expect(toggleButtonA).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(toggleButtonB).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(toggleButtonC).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(toggleButtonB).toHaveFocus();
    });

    it('should loop navigation when loop is enabled', async () => {
      const user = userEvent.setup();
      await setupDirective({ loop: true });
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      await user.tab();
      expect(toggleButtonA).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(toggleButtonC).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(toggleButtonA).toHaveFocus();
    });

    it('should handle navigation with multiple selected items', async () => {
      const user = userEvent.setup();
      await setupDirective({ value: ['a', 'c'], type: 'multiple' });
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonB = screen.getByLabelText('Center aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      await user.tab();
      expect(toggleButtonA).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(toggleButtonB).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(toggleButtonC).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(toggleButtonC).toHaveAttribute('data-state', 'off');
      expect(toggleButtonC).toHaveAttribute('aria-pressed', 'false');
      await user.keyboard('{ArrowLeft}');
      expect(toggleButtonB).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(toggleButtonB).toHaveAttribute('data-state', 'on');
      expect(toggleButtonB).toHaveAttribute('aria-pressed', 'true');
    });

    it('should navigate vertically when orientation is set to vertical', async () => {
      const user = userEvent.setup();
      await setupDirective({ orientation: 'vertical' });
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonB = screen.getByLabelText('Center aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      await user.tab();
      expect(toggleButtonA).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(toggleButtonB).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(toggleButtonC).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(toggleButtonB).toHaveFocus();
    });

    it('should disable roving focus when rovingFocus is set to false', async () => {
      const user = userEvent.setup();
      await setupDirective({ rovingFocus: false });
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonB = screen.getByLabelText('Center aligned');
      await user.tab();
      expect(toggleButtonA).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(toggleButtonA).toHaveFocus();
      expect(toggleButtonB).not.toHaveFocus();
    });

    it('should focus the first item when Home key is pressed', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      await user.tab();
      await user.keyboard('{ArrowRight}{ArrowRight}');
      expect(toggleButtonC).toHaveFocus();
      await user.keyboard('{Home}');
      expect(toggleButtonA).toHaveFocus();
    });

    it('should focus the last item when End key is pressed', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      await user.tab();
      expect(toggleButtonA).toHaveFocus();
      await user.keyboard('{End}');
      expect(toggleButtonC).toHaveFocus();
    });

    it('should skip disabled items during navigation', async () => {
      const user = userEvent.setup();
      await setupDirective({ disabled: true });
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      await user.tab();
      expect(toggleButtonA).not.toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(toggleButtonC).not.toHaveFocus();
    });

    it('should toggle the state of the focused item when Space key is pressed', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const toggleButtonA = screen.getByLabelText('Left aligned');
      await user.tab();
      expect(toggleButtonA).toHaveAttribute('data-state', 'off');
      expect(toggleButtonA).toHaveAttribute('aria-checked', 'false');
      await user.keyboard(' ');
      expect(toggleButtonA).toHaveAttribute('data-state', 'on');
      expect(toggleButtonA).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('when initializing the component', () => {
    it('should set the initial state based on the value input', async () => {
      await setupDirective({ value: 'b' });
      const toggleButtonB = screen.getByLabelText('Center aligned');
      expect(toggleButtonB).toHaveAttribute('data-state', 'on');
      expect(toggleButtonB).toHaveAttribute('aria-checked', 'true');
    });

    it('should set the initial state for multiple selected items based on the value input', async () => {
      await setupDirective({ value: ['a', 'c'], type: 'multiple' });
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonB = screen.getByLabelText('Center aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      expect(toggleButtonA).toHaveAttribute('data-state', 'on');
      expect(toggleButtonA).toHaveAttribute('aria-pressed', 'true');
      expect(toggleButtonB).toHaveAttribute('data-state', 'off');
      expect(toggleButtonB).toHaveAttribute('aria-pressed', 'false');
      expect(toggleButtonC).toHaveAttribute('data-state', 'on');
      expect(toggleButtonC).toHaveAttribute('aria-pressed', 'true');
    });

    it('should handle invalid or out-of-range value input', async () => {
      await setupDirective({ value: 'invalid' });
      const toggleButtonA = screen.getByLabelText('Left aligned');
      const toggleButtonB = screen.getByLabelText('Center aligned');
      const toggleButtonC = screen.getByLabelText('Right aligned');
      expect(toggleButtonA).toHaveAttribute('data-state', 'off');
      expect(toggleButtonA).toHaveAttribute('aria-checked', 'false');
      expect(toggleButtonB).toHaveAttribute('data-state', 'off');
      expect(toggleButtonB).toHaveAttribute('aria-checked', 'false');
      expect(toggleButtonC).toHaveAttribute('data-state', 'off');
      expect(toggleButtonC).toHaveAttribute('aria-checked', 'false');
    });
  });
});
