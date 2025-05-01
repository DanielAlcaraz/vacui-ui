import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { AccordionPrimitivesModule } from '../accordion.module';
import { AccordionValue } from '../model/accordion.model';

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  open?: boolean;
}

interface DirectiveConfig {
  value: AccordionValue;
  disabled: boolean;
  multiple: boolean;
  orientation: 'vertical' | 'horizontal';
  collapsible: boolean;
  valueChange: jest.Mock<any>;
  items: AccordionItem[];
}

const accordionItems: AccordionItem[] = [
  {
    id: 'item-1',
    title: 'item-1',
    open: true,
    description: 'item-description-1',
  },
  {
    id: 'item-2',
    title: 'item-2',
    open: true,
    description: 'item-description-2',
  },
  {
    id: 'item-3',
    title: 'item-3',
    open: true,
    description: 'item-description-3',
  },
];

describe('AccordionDirective', () => {
  const setupDirective = async ({
    value = null,
    disabled = false,
    multiple = false,
    orientation = 'vertical',
    collapsible = true,
    valueChange = jest.fn(),
    items = [...accordionItems],
  }: Partial<DirectiveConfig> = {}) => {
    return await render(
      `
        <div
          data-testid="root"
          vacAccordionRoot
          [multiple]="multiple"
          [value]="value"
          [collapsible]="collapsible"
          [disabled]="disabled"
          [orientation]="orientation"
          (valueChange)="valueChange($event)"
        >
          @for (accordion of items; track $index) {
            <div
              vacAccordionItem
              #item="vacAccordionItem"
              [attr.data-testid]="accordion.id"
              [value]="accordion.id"
              [disabled]="accordion.disabled"
            >
              <h3 vacAccordionHeader="2">
                <button vacAccordionTrigger>
                  {{ accordion.title }}
                </button>
              </h3>
              @if(item.state.isActive(accordion.id)) {
                <div vacAccordionContent>
                  <p>{{ accordion.description }}</p>
                </div>
              }
            </div>
          }
        </div>
      `,
      {
        imports: [AccordionPrimitivesModule],
        componentProperties: { value, disabled, valueChange, multiple, orientation, collapsible, items },
      },
    );
  };

  it('should create an accessible accordion', async () => {
    await setupDirective({ value: 'item-1' });
    expect(await axe(screen.getByTestId('root'))).toHaveNoViolations();
    expect(await axe(screen.getByText('item-1'))).toHaveNoViolations();
    expect(await axe(screen.getByText('item-description-1'))).toHaveNoViolations();
    expect(await axe(screen.getByText('item-2'))).toHaveNoViolations();
  });

  describe('when it is disabled', () => {
    it('should not allow selection', async () => {
      const user = userEvent.setup();
      await setupDirective({ disabled: true });
      await user.tab();
      await user.keyboard('{Enter}');
      expect(screen.getByTestId('item-1')).not.toHaveFocus();
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'closed');
    });

    it('should not emit a value', async () => {
      const valueChange = jest.fn();
      const user = userEvent.setup();
      await setupDirective({ disabled: true, valueChange });
      await user.tab();
      await user.keyboard('{Enter}');
      expect(valueChange).not.toHaveBeenCalled();
    });
  });

  describe('when it has a default value', () => {
    it('should open the item by default when it is not multiple', async () => {
      await setupDirective({ value: 'item-1', multiple: false });
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'open');
    });

    it('should open the items by default when it is multiple', async () => {
      await setupDirective({ value: ['item-1', 'item-2'], multiple: true });
      expect(screen.getByTestId('item-1')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('item-2')).toHaveAttribute('data-state', 'open');
    });

    it('should not emit the value', async () => {
      const valueChange = jest.fn();
      await setupDirective({ value: 'item-1', valueChange });
      expect(valueChange).not.toHaveBeenCalled();
    });
  });

  describe('when mutltiple is disabled and collapsible is true', () => {
    it('should toggle an item on click', async () => {
      const user = userEvent.setup();
      await setupDirective({ collapsible: true, multiple: false });
      const item = screen.getByText('item-1');
      await user.click(item);
      expect(item).toHaveAttribute('data-state', 'open');
      await user.click(item);
      expect(item).toHaveAttribute('data-state', 'closed');
    });

    it('should close prev item before opening a new one', async () => {
      const user = userEvent.setup();
      await setupDirective({ collapsible: true, multiple: false, value: 'item-1' });
      const item1 = screen.getByText('item-1');
      const item2 = screen.getByText('item-2');
      await user.click(item2);
      expect(item1).toHaveAttribute('data-state', 'closed');
      expect(item2).toHaveAttribute('data-state', 'open');
    });
  });

  describe('when multiple is true', () => {
    it('should be able to open more than one item at once', async () => {
      const user = userEvent.setup();
      await setupDirective({ collapsible: true, multiple: true });
      const item1 = screen.getByText('item-1');
      const item2 = screen.getByText('item-2');
      await user.click(item1);
      await user.click(item2);
      expect(item1).toHaveAttribute('data-state', 'open');
      expect(item2).toHaveAttribute('data-state', 'open');
      await user.click(item1);
      expect(item1).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('when collapsible if false', () => {
    it('should not allow to close an item when multiple is false', async () => {
      const user = userEvent.setup();
      await setupDirective({ collapsible: false, multiple: false, value: 'item-1' });
      const item1 = screen.getByText('item-1');
      await user.click(item1);
      expect(item1).toHaveAttribute('data-state', 'open');
    });

    it('should allow to close all items when multiple is true', async () => {
      const user = userEvent.setup();
      await setupDirective({ collapsible: false, multiple: true, value: ['item-1', 'item-2'] });
      const item1 = screen.getByText('item-1');
      const item2 = screen.getByText('item-2');
      await user.click(item1);
      await user.click(item2);
      expect(item1).toHaveAttribute('data-state', 'closed');
      expect(item2).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('when navigating with keyboard', () => {
    it('should toggle items with enter and space', async () => {
      const user = userEvent.setup();
      await setupDirective({ collapsible: false, multiple: true });
      await user.tab();
      await user.keyboard('{Enter}');
      expect(screen.getByText('item-1')).toHaveAttribute('data-state', 'open');
      await user.tab();
      await user.keyboard('{Enter}');
      expect(screen.getByText('item-2')).toHaveAttribute('data-state', 'open');
    })
  });
});
