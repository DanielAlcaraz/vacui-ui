import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CollapsibleStateService } from '../state/collapsible.service';
import { mockCollapsibleStateService } from '../state/collapsible.service.mock';
import { CollapsibleRootDirective } from './collapsible-root.directive';
import { CollapsibleTriggerDirective } from './collapsible-trigger.directive';
import { axe } from 'jest-axe';

interface DirectiveConfig {
  open: boolean;
  disabled: boolean;
  openChange: jest.Mock<any, any, any>;
}

describe('CollapsibleRootDirective', () => {
  let collapibleStateService: CollapsibleStateService;
  const setupDirective = async ({
    open = false,
    disabled = false,
    openChange = jest.fn(),
  }: Partial<DirectiveConfig> = {}) => {
    collapibleStateService = mockCollapsibleStateService() as unknown as CollapsibleStateService;

    return await render(
      `
    <div vacCollapsibleRoot [open]="open" [disabled]="disabled" (openChange)="openChange($event)">
      ROOT
      <button vacCollapsibleTrigger>BTN</button>
    </div>`,
      {
        imports: [CollapsibleRootDirective, CollapsibleTriggerDirective],
        componentProperties: { open, disabled, openChange },
        providers: [{ provide: CollapsibleStateService, useValue: collapibleStateService }],
      },
    );
  };

  it('should create an accessible collapsible', async () => {
    await setupDirective();
    expect(await axe(screen.queryByText('ROOT')!)).toHaveNoViolations();
  });

  it('should create the directive with initial closed state', async () => {
    await setupDirective();
    expect(screen.queryByText('ROOT')).toHaveAttribute('data-state', 'closed');
  });

  it('should set data-disabled when the directive is disabled', async () => {
    await setupDirective({ disabled: true });
    expect(screen.queryByText('ROOT')).toHaveAttribute('data-disabled', '');
  });

  it('should toggle data-state on state change', async () => {
    await setupDirective({ open: true });
    expect(screen.queryByText('ROOT')).toHaveAttribute('data-state', 'open');
  });

  it('should emit when state changes', async () => {
    const user = userEvent.setup();
    const openEvent = jest.fn();
    await setupDirective({ open: false, openChange: openEvent });
    await user.click(screen.queryByText('BTN')!);
    expect(openEvent).toHaveBeenCalledWith(true);
  });
});
