import { PLATFORM_ID } from '@angular/core';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { PortalDirective } from '@vacui-ui/primitives/portal';
import { axe } from 'jest-axe';
import { SelectCompareWith } from '../model/select.model';
import { SelectPrimitivesModule } from '../select.module';

interface DirectiveConfig {
  value: string | string[] | null;
  valueChange: jest.Mock<any>;
  open: boolean;
  openChange: jest.Mock<any>;
  name: string;
  disabled: boolean;
  required: boolean;
  multiple: boolean;
  compareWith: SelectCompareWith<string>;
  displayWith: ((value: string) => string) | null;
  onEscapeKeyDown: ((event: KeyboardEvent) => void) | null;
  placeholder: string;
}

describe('SelectPrimitives', () => {
  const setupDirective = async ({
    value = null,
    valueChange = jest.fn(),
    open = false,
    openChange = jest.fn(),
    name = 'select-name',
    disabled = false,
    required = false,
    multiple = false,
    compareWith = (v1, v2) => v1 === v2,
    displayWith = null,
    onEscapeKeyDown = null,
    placeholder = 'Select a value'
  }: Partial<DirectiveConfig> = {}) => {
    return await render(
      `
      <div
        data-testid="select"
        vacSelectRoot [value]="value"
        (valueChange)="valueChange($event)" [open]="open"
        (openChange)="openChange($event)"
        [name]="name"
        [disabled]="disabled"
        [required]="required"
        [multiple]="multiple"
        [compareWith]="compareWith"
        [onEscapeKeyDown]="onEscapeKeyDown"
      >
        <button data-testid="trigger" vacSelectTrigger aria-label="Food">
          <div vacSelectValue [displayWith]="displayWith" data-testid="value" [placeholder]="placeholder"></div>
        </button>
        <ng-container *vacPortal="'parent'">
          <div *vacSelectVisibility vacSelectContent data-testid="content">
            <div vacSelectViewport data-testid="viewport">
              <div vacSelectGroup>
                <div vacSelectLabel>Grupo 1</div>
                <div data-testid="value1" vacSelectItem value="value1">
                  <span vacSelectItemText>Item 1</span>
                  <span *vacSelectItemIndicator>Checked</span>
                </div>
                <div data-testid="value2" vacSelectItem value="value2" [disabled]="true">
                  <span vacSelectItemText>Item 2</span>
                  <span *vacSelectItemIndicator>Checked</span>
                </div>
              </div>
              <div vacSelectSeparator></div>
              <div vacSelectGroup>
                <div vacSelectLabel>Grupo 2</div>
                <div data-testid="value3" vacSelectItem value="value3">
                  <span vacSelectItemText>Item 3</span>
                  <span *vacSelectItemIndicator>Checked</span>
                </div>
                <div data-testid="value4" vacSelectItem value="value4">
                  <span vacSelectItemText>Item 4</span>
                  <span *vacSelectItemIndicator>Checked</span>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    `,
      {
        imports: [SelectPrimitivesModule, PortalDirective],
        autoDetectChanges: true,
        detectChangesOnRender: true,
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
        componentProperties: {
          value,
          valueChange,
          open,
          openChange,
          name,
          disabled,
          required,
          multiple,
          compareWith,
          displayWith,
          onEscapeKeyDown,
          placeholder
        },
      },
    );
  };

  it('should create an accessible select component', async () => {
    await setupDirective();
    expect(await axe(screen.getByTestId('select'))).toHaveNoViolations();
  });

  it('should display placeholder when there is no value', async () => {
    const element = await setupDirective({ placeholder: 'Hello' });
    await waitFor(() => {
      expect(element.getByTestId('value')).toHaveTextContent('Hello');
    });
  });

  describe('when using the trigger', () => {
    it('should open the select when it is clicked', async () => {
      const user = userEvent.setup();
      const select = await setupDirective();
      await user.click(screen.getByTestId('trigger'));
      expect(select.getByText('Item 1')).toBeVisible();
    });

    it('should display the selected item inside', async () => {
      const select = await setupDirective({ value: 'value3' });
      await waitFor(() => {
        expect(select.getByText('Item 3')).toBeVisible();
      });
    });

    it('should emit openChange when the select is opened or closed', async () => {
      const user = userEvent.setup();
      const openChange = jest.fn();
      await setupDirective({ openChange, open: true });

      expect(openChange).not.toHaveBeenCalledWith(true);
      await user.click(screen.getByTestId('trigger'));
      expect(openChange).toHaveBeenCalledWith(false);
      await user.keyboard('{Enter}');
      expect(openChange).toHaveBeenCalledWith(true);
      await user.keyboard('{Space}');
      expect(openChange).toHaveBeenCalledWith(false);
      await user.click(screen.getByTestId('trigger'));
      expect(openChange).toHaveBeenCalledWith(true);
      await user.keyboard('{Escape}');
      expect(openChange).toHaveBeenCalledWith(false);
      await user.keyboard('{Tab}');
      expect(openChange).toHaveBeenCalledWith(false);
    });
  });

  describe('when the select is open', () => {
    it('should select the correct item when clicked', async () => {
      const user = userEvent.setup();
      const select = await setupDirective();
      await user.click(select.getByTestId('trigger'));
      await user.click(select.getByText('Item 3'));
      await waitFor(() => {
        expect(select.getByText('Item 3')).toBeVisible();
      });
    });

    it('should select the highlighted item', async () => {
      const user = userEvent.setup();
      const valueChange = jest.fn();
      const select = await setupDirective({ valueChange });
      await user.click(select.getByTestId('trigger'));

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      expect(select.container).toHaveTextContent('Item 4');
    });

    it('should emit valueChange when a value is selected', async () => {
      const user = userEvent.setup();
      const valueChange = jest.fn();
      await setupDirective({ valueChange, open: true });
      // Select by click
      await user.click(screen.getByTestId('value3'));
      expect(valueChange).toHaveBeenCalledWith(['value3']);
      // Select by tab
      await user.click(screen.getByTestId('trigger'));
      await user.hover(screen.getByTestId('value3'));
      await user.tab();
      expect(valueChange).toHaveBeenCalledWith([]);
      // Select by enter
      await user.click(screen.getByTestId('trigger'));
      await user.hover(screen.getByTestId('value1'));
      await user.keyboard('{Enter}');
      expect(valueChange).toHaveBeenCalledWith(['value1']);
      // Select by space
      await user.click(screen.getByTestId('trigger'));
      await user.hover(screen.getByTestId('value4'));
      await user.keyboard('{Space}');
      expect(valueChange).toHaveBeenCalledWith(['value4']);
    });
  });

  describe('when the user uses the keyboard', () => {
    it('should navigate through items using arrow keys', async () => {
      const user = userEvent.setup();
      const select = await setupDirective();
      await user.click(select.getByTestId('trigger'));

      expect(select.getByTestId('value1')).toHaveAttribute('data-highlighted');

      await user.keyboard('{ArrowDown}');
      expect(select.getByTestId('value3')).toHaveAttribute('data-highlighted');

      await user.keyboard('{ArrowUp}');
      expect(select.getByTestId('value1')).toHaveAttribute('data-highlighted');
    });

    it('should search a value when trigger is focused and user types', async () => {
      const user = userEvent.setup();
      const select = await setupDirective();
      await user.tab();
      await user.type(select.getByTestId('trigger'), '4e');
      await user.keyboard('{Backspace}');
      await waitFor(() => {
        expect(select.getByTestId('value')).toHaveTextContent('Item 4');
      });
    });
  });

  describe('when select is disabled', () => {
    it('should not open the select on click', async () => {
      const user = userEvent.setup();
      const select = await setupDirective({ disabled: true });
      expect(select.getByTestId('trigger')).toHaveAttribute('aria-disabled', 'true');
      await user.click(select.getByTestId('trigger'));
      expect(select.queryByTestId('content')).not.toBeInTheDocument();
    });
  });

  describe('when it is multiple', () => {
    it('should be able to display more than one value', async () => {
      const select = await setupDirective({ multiple: true, value: ['value1', 'value3'] });
      await waitFor(() => {
        expect(select.getByTestId('value')).toHaveTextContent('Item 1, Item 3');
      });
    });

    it('should select the items when clicked', async () => {
      const user = userEvent.setup();
      const select = await setupDirective({ multiple: true });
      await user.click(select.getByTestId('trigger'));
      await user.click(select.getByText('Item 3'));
      await user.click(select.getByText('Item 1'));
      await waitFor(() => {
        expect(select.getByTestId('value')).toHaveTextContent('Item 3, Item 1');
      });
      await user.click(select.getByText('Item 3'));
      await waitFor(() => {
        expect(select.getByTestId('value')).toHaveTextContent('Item 1');
      });
    });
  });

  describe('when provide displayValue function', () => {
    it('should tranform the value and display only the number', async () => {
      const displayWith = (value: string) => value[5];
      const select = await setupDirective({ displayWith, value: 'value1' });

      await waitFor(() => {
        expect(select.getByTestId('value')).toHaveTextContent('1');
      });
    });

    it('should transform multiple values', async () => {
      const displayWith = (value: string) => value[5];
      const select = await setupDirective({ multiple: true, displayWith, value: ['value1', 'value3'] });

      await waitFor(() => {
        expect(select.getByTestId('value')).toHaveTextContent('1, 3');
      });
    });
  });

  it('should use the provided onEscapeKeyDown function', async () => {
    const user = userEvent.setup();
    const onEscapeKeyDown = jest.fn();
    const select = await setupDirective({ onEscapeKeyDown });
    await user.click(select.getByTestId('trigger'));
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
      expect(select.queryByTestId('content')).not.toBeInTheDocument();
    });
    // Focus content
    await user.click(select.getByTestId('trigger'));
    await user.click(select.getByTestId('content'));
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(onEscapeKeyDown).toHaveBeenCalledTimes(2);
      expect(select.queryByTestId('content')).not.toBeInTheDocument();
    });
  });

  it('should use the provided compareWith function', async () => {
    const compareWith: SelectCompareWith<string> = (v1, v2) => {
      return v1?.[5] === v2?.[5];
    };
    const select = await setupDirective({ compareWith, value: 'value1' });

    await waitFor(() => {
      expect(select.getByTestId('value')).toHaveTextContent('Item 1');
    });
  });
});
