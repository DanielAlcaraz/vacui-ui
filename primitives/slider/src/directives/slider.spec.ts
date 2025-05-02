import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { SliderPrimitivesModule } from '../slider.module';
import userEvent from '@testing-library/user-event';

interface DirectiveConfig {
  orientation: 'horizontal' | 'vertical';
  min: number;
  max: number;
  step: number;
  value: number[];
  inverted: boolean;
  minStepsBetweenThumbs: number;
  disabled: boolean;
  name: string;
  bigStepFactor: number;
  valueChange: jest.Mock<any>;
  valueCommit: jest.Mock<any>;
}

describe('SliderDirectives', () => {
  const setupDirective = async ({
    orientation = 'horizontal',
    min = 0,
    max = 100,
    bigStepFactor = 10,
    disabled = false,
    inverted = false,
    minStepsBetweenThumbs = 0,
    step = 1,
    value = [0],
    name = 'slider',
    valueChange = jest.fn(),
    valueCommit = jest.fn(),
  }: Partial<DirectiveConfig> = {}) => {
    return await render(
      `
      <span
      vacSliderRoot
      [min]="min"
      [max]="max"
      [step]="step"
      [value]="value"
      [orientation]="orientation"
      [inverted]="inverted"
      [minStepsBetweenThumbs]="minStepsBetweenThumbs"
      [disabled]="disabled"
      [name]="name"
      (valueChange)="valueChange($event)"
      (valueCommit)="valueCommit($event)"
      class="slider-root"
      data-testid="root"
    >
      <span vacSliderTrack data-testid="track" class="track">
        <span vacSliderRange class="range" data-testid="range"></span>
      </span>
      @for (item of value; track $index) {
        <span
          vacSliderThumb
          class="thumb"
          aria-label="Volume"
          data-testid="thumb"
        ></span>
      }
      <input vacSliderInput data-testid="input" />
    </span>
      `,
      {
        imports: [SliderPrimitivesModule],
        autoDetectChanges: true,
        configureTestBed(testbed) {
          testbed.compileComponents();
        },
        componentProperties: {
          orientation,
          min,
          max,
          bigStepFactor,
          disabled,
          inverted,
          minStepsBetweenThumbs,
          step,
          name,
          value,
          valueChange,
          valueCommit,
        },
      },
    );
  };

  it('should create an accessible horizontal slider', async () => {
    await setupDirective();
    expect(await axe(screen.getByTestId('root'))).toHaveNoViolations();
  });


  it('should update the value when using keyboard navigation', async () => {
    const user = userEvent.setup();
    const valueChange = jest.fn();
    await setupDirective({ valueChange });

    const thumbElement = screen.getByTestId('thumb');
    thumbElement.focus();

    await user.keyboard('{ArrowRight}');
    expect(valueChange).toHaveBeenCalledWith([1]);

    await user.keyboard('{ArrowLeft}');
    expect(valueChange).toHaveBeenCalledWith([0]);

    await user.keyboard('{ArrowUp}');
    expect(valueChange).toHaveBeenCalledWith([1]);

    await user.keyboard('{ArrowDown}');
    expect(valueChange).toHaveBeenCalledWith([0]);

    await user.keyboard('{PageUp}');
    expect(valueChange).toHaveBeenCalledWith([10]);

    await user.keyboard('{PageDown}');
    expect(valueChange).toHaveBeenCalledWith([0]);

    await user.keyboard('{Home}');
    expect(valueChange).toHaveBeenCalledWith([0]);

    await user.keyboard('{End}');
    expect(valueChange).toHaveBeenCalledWith([100]);
  });
});
