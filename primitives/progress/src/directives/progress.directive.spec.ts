import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { ProgressRootDirective } from './progress-root.directive';
import { ProgressIndicatorDirective } from './progress-indicator.directive';

interface DirectiveConfig {
  value: number | null;
  max: number;
  getValueLabel?: (value: number, max: number) => string;
}

describe('ProgressRootDirective', () => {
  const labelFunction = (value: number, max: number) => `${value} of ${max}`;
  const setupDirective = async ({ value = null, max = 100, getValueLabel = undefined }: Partial<DirectiveConfig> = {}) => {
    return await render(
      `
    <div vacProgressRoot aria-label="Progress status" [value]="value" [max]="max" [getValueLabel]="getValueLabel">
      <div vacProgressIndicator data-testid="indicator"></div>
    </div>`,
      {
        imports: [ProgressRootDirective, ProgressIndicatorDirective],
        componentProperties: { value, max, getValueLabel },
      },
    );
  };

  it('should create an accessible progress bar', async () => {
    await setupDirective({ value: 50, max: 100 });
    const progressbar = screen.getByRole('progressbar')!;
    expect(await axe(progressbar)).toHaveNoViolations();
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuetext', '50%');
  });

  it('should has indeterminate state when value is not provided', async () => {
    await setupDirective({ max: 100 });
    const progressbar = screen.getByRole('progressbar')!;
    expect(progressbar).toHaveAttribute('data-state', 'indeterminate');
  });

  it('it should display a custom valuetext aria attribute', async () => {
    await setupDirective({ value: 50, max: 100, getValueLabel: labelFunction });
    const progressbar = screen.getByRole('progressbar')!;
    expect(progressbar).toHaveAttribute('aria-valuetext', '50 of 100');
  });

  it('should display data attributes correctly', async () => {
    await setupDirective({ value: 50, max: 100 });
    const progressbar = screen.getByRole('progressbar')!;
    expect(progressbar).toHaveAttribute('data-value', '50');
    expect(progressbar).toHaveAttribute('data-max', '100');
    expect(progressbar).toHaveAttribute('data-state', 'loading');
  });

  it('should set state to complete when value is equal to max', async () => {
    await setupDirective({ value: 100, max: 100 });
    expect(screen.getByRole('progressbar')!).toHaveAttribute('data-state', 'complete');
  });

  it('should display data attributes in progress indicator correctly', async () => {
    await setupDirective({ value: 50, max: 100 });
    const progressbar = screen.getByTestId('indicator')!;
    expect(progressbar).toHaveAttribute('data-value', '50');
    expect(progressbar).toHaveAttribute('data-max', '100');
    expect(progressbar).toHaveAttribute('data-state', 'loading');
  });
});
