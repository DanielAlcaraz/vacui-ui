import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { KeyNavigationRootDirective } from './key-navigation-root.directive';
import { KeyNavigationItemDirective } from './key-navigation-item.directive';
import { FocusCallback, NavigationDirection, Rule } from '../models/keyboard-navigation.model';

interface DirectiveConfig {
  navigationRules: Rule[];
  direction: NavigationDirection;
  loop: boolean;
  disabled: boolean;
  tabNavigation: boolean;
  focusCallback: FocusCallback;
  rememberLastFocus: boolean;
  items: { text: string; disabled: boolean; startFocus: boolean }[];
  mode: 'focus' | 'highlight';
  highlightCallback: FocusCallback;
}

const buttonItems = [
  { text: 'BTN1', disabled: false, startFocus: false },
  { text: 'BTN2', disabled: false, startFocus: false },
  { text: 'BTN3', disabled: false, startFocus: false },
];

describe('KeyboardNavigable', () => {
  const setupDirective = async ({
    navigationRules = [],
    direction = 'vertical',
    loop = true,
    disabled = false,
    tabNavigation = true,
    focusCallback = null,
    rememberLastFocus = false,
    items = buttonItems,
    mode = 'focus',
    highlightCallback = null,
  }: Partial<DirectiveConfig> = {}) => {
    return await render(
      `
      <div vacKeyNavigationRoot
        [navigationRules]="navigationRules"
        [direction]="direction"
        [loop]="loop"
        [disabled]="disabled"
        [tabNavigation]="tabNavigation"
        [focusCallback]="focusCallback"
        [rememberLastFocus]="rememberLastFocus"
        [mode]="mode"
        [highlightCallback]="highlightCallback"
      >
        @for(item of items; track item.text) {
          <button
            vacKeyNavigationItem
            [disabled]="item.disabled"
            [startFocus]="item.startFocus"
          >
            {{ item.text }}
          </button>
        }
      </div>
    `,
      {
        imports: [KeyNavigationRootDirective, KeyNavigationItemDirective],
        componentProperties: {
          navigationRules,
          direction,
          loop,
          disabled,
          tabNavigation,
          rememberLastFocus,
          focusCallback,
          items,
          mode,
          highlightCallback,
        },
      },
    );
  };

  describe('when navigate with tab', () => {
    it('should change focus if its not disabled', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.tab();
      expect(screen.queryByText('BTN2')).toHaveFocus();
    });
  });

  describe('when tab navigation is disabled', () => {
    it('should only focus the first item with tab navigation when pressing tab more than once', async () => {
      const user = userEvent.setup();
      await setupDirective({ tabNavigation: false });
      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.tab();
      expect(screen.queryByText('BTN1')).not.toHaveFocus();
      expect(screen.queryByText('BTN2')).not.toHaveFocus();
      expect(screen.queryByText('BTN3')).not.toHaveFocus();
    });

    it('should not return to the first item after moving focus with shift + tab', async () => {
      const user = userEvent.setup();
      await setupDirective({ tabNavigation: false });
      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN2')).toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.queryByText('BTN3')).not.toHaveFocus();
      expect(screen.queryByText('BTN2')).not.toHaveFocus();
      expect(screen.queryByText('BTN1')).not.toHaveFocus();
    });

    it('should not navigate with tab to the prev item after focus the next item with click', async () => {
      const user = userEvent.setup();
      await setupDirective({ tabNavigation: false });
      await user.click(screen.queryByText('BTN2')!);
      expect(screen.queryByText('BTN2')).toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.queryByText('BTN1')).not.toHaveFocus();
      expect(screen.queryByText('BTN2')).not.toHaveFocus();
      expect(screen.queryByText('BTN3')).not.toHaveFocus();
    });
  });

  it('should navigate to the END and HOME', async () => {
    const user = userEvent.setup();
    await setupDirective({ tabNavigation: false });
    await user.tab();
    await user.keyboard('{End}');
    expect(screen.queryByText('BTN3')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.queryByText('BTN1')).toHaveFocus();
  });

  it('should call a focus callback when it is provided', async () => {
    const user = userEvent.setup();
    const callback = jest.fn();
    await setupDirective({ focusCallback: callback });
    await user.tab();
    await user.keyboard('{End}');
    expect(screen.queryByText('BTN3')).toHaveFocus();
    expect(callback).toHaveBeenCalled();
  });

  it('should set correct disabled and aria attributes in navigable items when disabled', async () => {
    const user = userEvent.setup();
    await setupDirective({ disabled: true });
    await user.tab();
    expect(screen.queryByText('BTN1')).toHaveAttribute('disabled');
    expect(screen.queryByText('BTN1')).toHaveAttribute('aria-disabled');
  });

  describe('when direction is vertical', () => {
    it('should loop when loop is true when navigate with arrows', async () => {
      const user = userEvent.setup();
      await setupDirective();
      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN2')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN3')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(screen.queryByText('BTN3')).toHaveFocus();
    });

    it('should not loop when navigate with arrows when loop is false', async () => {
      const user = userEvent.setup();
      await setupDirective({ loop: false });
      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN2')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN3')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN1')).not.toHaveFocus();
      expect(screen.queryByText('BTN3')).toHaveFocus();
    });
  });

  describe('when direction is horizontal', () => {
    it('should loop when loop is true and navigate with arrows', async () => {
      const user = userEvent.setup();
      await setupDirective({ direction: 'horizontal' });
      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.queryByText('BTN2')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.queryByText('BTN3')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.queryByText('BTN3')).toHaveFocus();
    });

    it('should not loop when navigate with arrows when loop is false', async () => {
      const user = userEvent.setup();
      await setupDirective({ loop: false, direction: 'horizontal' });
      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.queryByText('BTN2')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.queryByText('BTN3')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.queryByText('BTN1')).not.toHaveFocus();
      expect(screen.queryByText('BTN3')).toHaveFocus();
    });
  });

  describe('when it has navigation rules', () => {
    it('should execute a custom callback without overriding default navigation when override is false', async () => {
      const customCallback = jest.fn();
      const navigationRules: Rule[] = [{ key: 'ArrowDown', callback: customCallback, override: false }];

      const user = userEvent.setup();
      await setupDirective({ navigationRules, loop: false });

      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(customCallback).toHaveBeenCalled();
      expect(screen.queryByText('BTN2')).toHaveFocus();
    });

    it('should execute a custom callback and prevent default navigation when override is true', async () => {
      const customCallback = jest.fn();
      const navigationRules: Rule[] = [{ key: 'ArrowDown', callback: customCallback, override: true }];

      const user = userEvent.setup();
      await setupDirective({ navigationRules, loop: false });

      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(customCallback).toHaveBeenCalled();
      expect(screen.queryByText('BTN2')).not.toHaveFocus();
    });
  });

  describe('when an item or more are disabled', () => {
    it('should skip disabled items and focus the nearest one', async () => {
      const user = userEvent.setup();
      await render(
        `
        <div vacKeyNavigationRoot>
          <button vacKeyNavigationItem>BTN1</button>
          <button vacKeyNavigationItem [disabled]="true">BTN2</button>
          <button vacKeyNavigationItem>BTN3</button>
        </div>
        `,
        {
          imports: [KeyNavigationRootDirective, KeyNavigationItemDirective],
        },
      );

      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN3')).toHaveFocus();
      expect(screen.queryByText('BTN2')).not.toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(screen.queryByText('BTN1')).toHaveFocus();
      expect(screen.queryByText('BTN2')).not.toHaveFocus();
    });

    it('should not focus disabled items when navigating with tab and focus the nearest one', async () => {
      const user = userEvent.setup();
      await render(
        `
        <div vacKeyNavigationRoot [tabNavigation]="true">
          <button vacKeyNavigationItem>BTN1</button>
          <button vacKeyNavigationItem [disabled]="true">BTN2</button>
          <button vacKeyNavigationItem>BTN3</button>
        </div>
        `,
        {
          imports: [KeyNavigationRootDirective, KeyNavigationItemDirective],
        },
      );

      await user.tab();
      expect(screen.queryByText('BTN1')).toHaveFocus();
      await user.tab();
      expect(screen.queryByText('BTN3')).toHaveFocus();
      expect(screen.queryByText('BTN2')).not.toHaveFocus();
    });
  });

  describe('when remember focus is disabled', () => {
    it('should not remember the last focused item on re-focusing', async () => {
      const user = userEvent.setup();
      await setupDirective({ rememberLastFocus: false, tabNavigation: false });
      await user.click(screen.getByText('BTN2'));
      expect(screen.getByText('BTN2')).toHaveFocus();
      await user.tab();
      expect(screen.getByText('BTN1')).not.toHaveFocus();
      expect(screen.getByText('BTN2')).not.toHaveFocus();
      expect(screen.getByText('BTN3')).not.toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByText('BTN1')).toHaveFocus();
    });
  });

  describe('when remember focused is true', () => {
    it('should remember the last focused item on re-focusing', async () => {
      const user = userEvent.setup();
      await setupDirective({ rememberLastFocus: true, tabNavigation: false });
      await user.click(screen.getByText('BTN2'));
      expect(screen.getByText('BTN2')).toHaveFocus();
      await user.tab();
      expect(screen.getByText('BTN1')).not.toHaveFocus();
      expect(screen.getByText('BTN2')).not.toHaveFocus();
      expect(screen.getByText('BTN3')).not.toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByText('BTN2')).toHaveFocus();
    });
  });

  it('should skip disabled items when navigating', async () => {
    const user = userEvent.setup();
    const newItems = [...buttonItems];
    newItems[1].disabled = true;
    await setupDirective({ tabNavigation: false, rememberLastFocus: false });
    await user.tab();
    expect(screen.queryByText('BTN1')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('BTN3')).toHaveFocus();
    newItems[1].disabled = false;
  });

  it('it should recalculate focus after an item has been added dynamically', async () => {
    // TODO: Find a way to add an element dynamically in the test. Code works.
  });

  describe('when an item has a default start focus and there is not tab naigation', () => {
    it('it should move focus with tab in the desired item', async () => {
      const user = userEvent.setup();
      const newItems = [...buttonItems];
      newItems[1].startFocus = true;
      await setupDirective({ tabNavigation: false, items: newItems });
      await user.tab();
      expect(screen.getByText('BTN2')).toHaveFocus();
      newItems[1].startFocus = false;
    });

    it('it should reset focus after first focus navigation when rememberLastFocus is false', async () => {
      const user = userEvent.setup();
      const newItems = [...buttonItems];
      newItems[1].startFocus = true;
      await setupDirective({ tabNavigation: false, items: newItems, rememberLastFocus: false });
      await user.tab();
      expect(screen.getByText('BTN2')).toHaveFocus();
      await user.tab();
      expect(screen.getByText('BTN1')).not.toHaveFocus();
      expect(screen.getByText('BTN2')).not.toHaveFocus();
      expect(screen.getByText('BTN3')).not.toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByText('BTN1')).toHaveFocus();
      newItems[1].startFocus = false;
    });

    it('it should not reset focus after first focus navigation when rememberLastFocus is true', async () => {
      const user = userEvent.setup();
      const newItems = [...buttonItems];
      newItems[1].startFocus = true;
      await setupDirective({ tabNavigation: false, items: newItems, rememberLastFocus: true });
      await user.tab();
      expect(screen.getByText('BTN2')).toHaveFocus();
      await user.tab();
      expect(screen.getByText('BTN1')).not.toHaveFocus();
      expect(screen.getByText('BTN2')).not.toHaveFocus();
      expect(screen.getByText('BTN3')).not.toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByText('BTN2')).toHaveFocus();
      newItems[1].startFocus = false;
    });
  });

  describe('when in highlight mode', () => {
    it('should navigate through items without changing focus', async () => {
      const user = userEvent.setup();
      const highlightCallback = jest.fn();
      await setupDirective({ mode: 'highlight', highlightCallback });
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN2')).not.toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN3')).not.toHaveFocus();
      expect(highlightCallback).toHaveBeenCalledTimes(2);
    });

    it('should call the highlight callback with the correct index', async () => {
      const user = userEvent.setup();
      const highlightCallback = jest.fn();
      await setupDirective({ mode: 'highlight', highlightCallback });
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(highlightCallback).toHaveBeenCalledWith(1, screen.getByText('BTN2'));
      await user.keyboard('{ArrowDown}');
      expect(highlightCallback).toHaveBeenCalledWith(2, screen.getByText('BTN3'));
    });

    it('should set the tabindex to -1 for all items', async () => {
      const user = userEvent.setup();
      await setupDirective({ tabNavigation: false, mode: 'highlight' });
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.queryByText('BTN1')).toHaveAttribute('tabindex', '-1');
      expect(screen.queryByText('BTN2')).toHaveAttribute('tabindex', '-1');
      expect(screen.queryByText('BTN3')).toHaveAttribute('tabindex', '-1');
    });
  });
});
