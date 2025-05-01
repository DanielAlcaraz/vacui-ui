import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { SeparatorRootDirective } from './separator-root.directive';

interface DirectiveConfig {
  orientation: 'horizontal' | 'vertical';
  decorative: boolean;
}

describe('SeparatorRootDirective', () => {
  const setupDirective = async ({
    orientation = 'horizontal',
    decorative = false
  }: Partial<DirectiveConfig> = {}) => {
    return await render(`
      <div vacSeparatorRoot
        data-testid="separator"
        [orientation]="orientation"
        [decorative]="decorative"
      ></div>
      `,
      {
        imports: [SeparatorRootDirective],
        componentProperties: { orientation, decorative },
      },
    );
  };

  it('should create a separator with correct role and orientation', async () => {
    await setupDirective({ orientation: 'horizontal', decorative: false });
    expect(screen.getByTestId('separator')).toHaveAttribute('role', 'separator');
    expect(screen.getByTestId('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('should handle the decorative flag correctly', async () => {
    await setupDirective({ decorative: true });
    expect(screen.getByTestId('separator')).toHaveAttribute('role', 'none');
    expect(screen.getByTestId('separator')).not.toHaveAttribute('aria-orientation');
  });

  it('should be accessible', async () => {
    await setupDirective({ orientation: 'vertical' });
    expect(await axe(screen.getByTestId('separator'))).toHaveNoViolations();
  });

  describe('when orientation is vertical', () => {
    it('should reflect vertical orientation', async () => {
      await setupDirective({ orientation: 'vertical' });
      expect(screen.getByTestId('separator')).toHaveAttribute('aria-orientation', 'vertical');
    });
  });
});
