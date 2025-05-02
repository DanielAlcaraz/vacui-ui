import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RadioGroupPrimitivesModule } from '../radio-group.module';
import { ReactiveFormsModule } from '@angular/forms';

interface DirectiveConfig {
  value: string | null;
  disabled: boolean;
  name: string;
  required: boolean;
  valueChange: jest.Mock<any>;
  onSubmit: jest.Mock<any>;
}

describe('RadioGroupRootDirective', () => {
  const setupDirective = async ({
    value = null,
    disabled = false,
    name = 'toggleGroup',
    required = false,
    valueChange = jest.fn(),
    onSubmit = jest.fn(),
  }: Partial<DirectiveConfig> = {}) => {
    return await render(`
      <form (submit)="onSubmit($event)">
        <div vacRadioGroupRoot
          data-testid="root"
          aria-label="View list"
          [name]="name"
          [value]="value"
          [disabled]="disabled"
          [required]="required"
          (valueChange)="valueChange($event)"
        >
          <div>
            <button vacRadioGroupItem value="radio1" id="radio1" aria-labelledby="radio1-label">
              <span vacRadioGroupIndicator></span>
            </button>
            <input value="radio1" vacRadioGroupInput />
            <label id="radio1-label" for="radio1">Radio 1</label>
          </div>

          <div>
            <button vacRadioGroupItem value="radio2" id="radio2" aria-labelledby="radio2-label">
              <span vacRadioGroupIndicator></span>
            </button>
            <input value="radio2" vacRadioGroupInput />
            <label id="radio2-label" for="radio2">Radio 2</label>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      `,
      {
        imports: [RadioGroupPrimitivesModule, ReactiveFormsModule],
        componentProperties: { value, disabled, name, required, valueChange, onSubmit },
      },
    );
  };

  it('should create an accessible radio group', async () => {
    await setupDirective();
    expect(await axe(screen.getByTestId('root'))).toHaveNoViolations();
  });

  describe('when it is disabled', () => {
    it('should not allow selection', async () => {
      const user = userEvent.setup();
      await setupDirective({ disabled: true });
      await user.click(screen.getByLabelText('Radio 1'));
      expect(screen.getByLabelText('Radio 1').closest('button')).not.toHaveAttribute('aria-checked', 'true');
    });

    it('should not emit a value', async () => {
      const valueChange = jest.fn();
      const user = userEvent.setup();
      await setupDirective({ disabled: true, valueChange });
      await user.click(screen.getByLabelText('Radio 1'));
      expect(valueChange).not.toHaveBeenCalled();
    });
  });

  it('should reflect the initial value correctly and get first focus when navigate with the keyboard', async () => {
    const user = userEvent.setup();
    await setupDirective({ value: 'radio2' });
    const button = screen.getByLabelText('Radio 2').closest('button');
    expect(button).toHaveAttribute('aria-checked', 'true');
    await user.tab();
    expect(button).toHaveFocus();
  });

  it('should change value when we click a label associated with an indicator', async () => {
    const user = userEvent.setup();
    await setupDirective({ value: 'radio1' });

    await user.click(screen.getByLabelText('Radio 2'));
    expect(screen.getByLabelText('Radio 1').closest('button')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByLabelText('Radio 2').closest('button')).toHaveAttribute('aria-checked', 'true');
  });

  it('should submit form with the selected radio value', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn(event => {
      event.preventDefault();
      const formData = new FormData(event.target);
      expect(formData.get('toggleGroup')).toEqual('radio1');
    });
    await setupDirective({ onSubmit });
    await user.tab();
    await user.keyboard('{Space}');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalled();
  });
});

