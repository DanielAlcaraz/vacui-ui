import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { TabsPrimitivesModule } from '../tabs.module';
import userEvent from '@testing-library/user-event';

interface DirectiveConfig {
  value: string | null;
  orientation: 'horizontal' | 'vertical';
  automatic: boolean;
  loop: boolean;
  valueChange: jest.Mock<any>;
}

describe('TabsPrimitives', () => {
  const setupDirective = async ({
    value = null,
    orientation = 'horizontal',
    automatic = true,
    loop = true,
    valueChange = jest.fn(),
  }: Partial<DirectiveConfig> = {}) => {
    return await render(
      `
      <div vacTabsRoot [value]="value" [orientation]="orientation" [automatic]="automatic" (valueChange)="valueChange($event)">
        <div vacTabsList [loop]="loop">
          <button data-testid="tab1" vacTabsTrigger="tab1">Tab 1</button>
          <button data-testid="tab2" vacTabsTrigger="tab2">Tab 2</button>
          <button data-testid="tab3" vacTabsTrigger="tab3" [disabled]="true">Tab 3</button>
        </div>
        <div>
          <div *vacTabsContent="'tab1'">Content 1</div>
          <div *vacTabsContent="'tab2'">Content 2</div>
          <div *vacTabsContent="'tab3'">Content 3</div>
        </div>
      </div>
    `,
      {
        imports: [TabsPrimitivesModule],
        componentProperties: { value, orientation, automatic, valueChange, loop },
      },
    );
  };

  it('should create an accessible tabs component', async () => {
    await setupDirective();
    expect(await axe(screen.getByRole('tablist'))).toHaveNoViolations();
  });

  it('should activate the correct tab when clicked', async () => {
    const user = userEvent.setup();
    await setupDirective();

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    await user.click(tab2);

    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  describe('Keyboard navigation', () => {
    it('should navigate between tabs using arrow keys', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should navigate to the first tab using the Home key', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
      await user.keyboard('{Home}');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should navigate to the last tab using the End key', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
      await user.keyboard('{End}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });

    it('should focus the selected tab when navigating with keyboard and automatic is true', async () => {
      const user = userEvent.setup();
      await setupDirective({ automatic: true });

      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });

    it('should not focus the selected tab when navigating with keyboard and automatic is false', async () => {
      const user = userEvent.setup();
      await setupDirective({ automatic: false });

      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      await user.keyboard('{ArrowRight}');

      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    });

    it('should skip disabled tabs when navigating with arrow keys', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should navigate to the last non-disabled tab using the End key', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      await user.keyboard('{End}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });

    it('should navigate to the previous non-disabled tab when loop is false', async () => {
      const user = userEvent.setup();
      await setupDirective({ orientation: 'vertical', loop: false });
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });

    it('should navigate to the next non-disabled tab when loop is false', async () => {
      const user = userEvent.setup();
      await setupDirective({ loop: false });
      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });

    it('should wrap around to the last non-disabled tab when loop is true and navigating backwards', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });

    it('should wrap around to the first non-disabled tab when loop is true and navigating forwards', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
    });
  });

  it('should not activate a disabled tab', async () => {
    const user = userEvent.setup();
    await setupDirective();

    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
    await user.click(tab3);

    expect(tab3).toHaveAttribute('aria-selected', 'false');
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('should have the correct orientation', async () => {
    await setupDirective({ orientation: 'vertical' });

    const tablist = screen.getByRole('tablist');
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('should emit a value when value changes', async () => {
    const user = userEvent.setup();
    const valueChange = jest.fn();
    await setupDirective({ valueChange });

    expect(valueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(valueChange).toHaveBeenCalledWith('tab2');
  });

  it('should focus first the selected tab', async () => {
    const user = userEvent.setup();
    await setupDirective({ value: 'tab2', automatic: true });
    await user.tab();
    expect(screen.getByTestId('tab2')).toHaveFocus();
  });

  it('should activate the tab specified by the value input', async () => {
    await setupDirective({ value: 'tab2' });

    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content 2')).toBeVisible();
  });

  it('should navigate in the correct direction based on orientation input', async () => {
    const user = userEvent.setup();
    await setupDirective({ orientation: 'vertical' });

    await user.click(screen.getByRole('tab', { name: 'Tab 1' }));

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveFocus();
  });

  it('should focus the active tab when re-entering focus', async () => {
    const user = userEvent.setup();
    await setupDirective({ value: 'tab2' });

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    await user.click(tab2);
    await user.tab();
    await user.keyboard('{Shift>}{Tab}{/Shift}');

    expect(tab2).toHaveFocus();
  });
});
