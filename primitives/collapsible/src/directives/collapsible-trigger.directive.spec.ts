import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { CollapsibleStateService } from '../state/collapsible.service';
import { mockCollapsibleStateService } from '../state/collapsible.service.mock';
import { CollapsibleTriggerDirective } from './collapsible-trigger.directive';

interface DirectiveConfig {
  open: boolean;
  disabled: boolean;
  openChange: jest.Mock<any, any, any>;
}

describe('CollapsibleTriggerDirective', () => {
  let collapibleStateService: CollapsibleStateService;
  const setupDirective = async ({
    open = false,
    disabled = false,
    openChange = jest.fn(),
  }: Partial<DirectiveConfig> = {}) => {
    collapibleStateService = mockCollapsibleStateService() as unknown as CollapsibleStateService;
    collapibleStateService.open.set(open);
    collapibleStateService.disabled.set(disabled);

    return await render(`<button vacCollapsibleTrigger>BTN</button>`, {
      imports: [CollapsibleTriggerDirective],
      componentOutputs: { openChange: { emit: openChange } },
      providers: [{ provide: CollapsibleStateService, useValue: collapibleStateService }],
    });
  };

  it('should create a trigger', async () => {
    await setupDirective();
    const btn = screen.queryByText('BTN')!;
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(await axe(btn)).toHaveNoViolations();
  });

  it('should have correct aria-controls attribute', async () => {
    await setupDirective();
    const id = collapibleStateService.getContentId();
    const btn = screen.queryByText('BTN')!;
    expect(btn).toHaveAttribute('aria-controls', id);
  });

  describe('when clicking the trigger', () => {
    it('should toggle the open state', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const btn = screen.queryByText('BTN')!;
      await user.click(btn);
      expect(btn).toHaveAttribute('data-state', 'open');
      expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    it('should toggle the state to close when it is opened', async () => {
      const user = userEvent.setup();
      await setupDirective({ open: true });
      const btn = screen.queryByText('BTN')!;
      await user.click(btn);
      expect(btn).toHaveAttribute('data-state', 'closed');
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    });

    it("shouldn't toggle the state when it is disabled", async () => {
      const user = userEvent.setup();
      await setupDirective({ open: true, disabled: true });
      const btn = screen.queryByText('BTN')!;
      await user.click(btn);
      expect(btn).toHaveAttribute('data-state', 'open');
      expect(btn).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('when press space/enter', () => {
    it('should toggle the state', async () => {
      const user = userEvent.setup();
      await setupDirective();
      const btn = screen.queryByText('BTN')!;
      btn.focus();
      await user.keyboard('{Enter}');
      expect(btn).toHaveAttribute('data-state', 'open');
      expect(btn).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{ }');
      expect(btn).toHaveAttribute('data-state', 'closed');
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
