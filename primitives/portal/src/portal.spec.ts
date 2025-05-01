import { render, screen } from '@testing-library/angular';
import { PortalDirective } from './portal.directive';

describe('PortalDirective', () => {
  const setup = async () => {
    return await render(
      `
      <div data-testid="target" id="target"></div>
      <ng-template vacPortal="#target">
        <div data-testid="teleported-content">Hello, Portal!</div>
      </ng-template>
    `,
      {
        imports: [PortalDirective],
      },
    );
  };

  it('should create an accessible dialog', async () => {
    await setup();
    const element = await screen.findByTestId('target');
    expect(element.children).toHaveLength(1);
  });
});
