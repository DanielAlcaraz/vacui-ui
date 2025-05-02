import { render, screen } from '@testing-library/angular';
import { CollapsibleStateService } from '../state/collapsible.service';
import { mockCollapsibleStateService } from '../state/collapsible.service.mock';
import { CollapsibleContentDirective } from './collapsible-content.directive';
import { CollapsibleTriggerDirective } from './collapsible-trigger.directive';

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
    collapibleStateService.open.set(open);
    collapibleStateService.disabled.set(disabled);
    collapibleStateService.getContentId();

    return await render(
      `
    <div>
      <button vacCollapsibleTrigger>BTN</button>
      @if(open) {
        <div vacCollapsibleContent>CONTENT</div>
      }
    </div>`,
      {
        imports: [CollapsibleTriggerDirective, CollapsibleContentDirective],
        componentProperties: { open },
        providers: [{ provide: CollapsibleStateService, useValue: collapibleStateService }],
      },
    );
  };

  it('should not show content when state is closed', async () => {
    await setupDirective();
    expect(screen.queryByText('CONTENT')).not.toBeInTheDocument();
  });

  it('should show content when state is open', async () => {
    await setupDirective({ open: true });
    expect(screen.queryByText('CONTENT')).toBeInTheDocument();
  });

  it('should have correct data attributes', async () => {
    const id = collapibleStateService.getContentId();
    await setupDirective({ open: true, disabled: true });
    const content = screen.queryByText('CONTENT')!;
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveAttribute('data-disabled', '');
    expect(content).toHaveAttribute('id', id);
  });
});
