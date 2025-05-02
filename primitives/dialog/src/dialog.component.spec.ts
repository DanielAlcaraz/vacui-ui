import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogPrimitivesModule } from './dialog.module';
import { PortalDirective } from '@vacui-kit/primitives/portal';
import { PLATFORM_ID } from '@angular/core';

interface DirectiveConfig {
  open: boolean;
}

describe('DialogComponent', () => {
  const setup = async ({ open = false }: Partial<DirectiveConfig> = {}) => {
    return await render(
      `
      <div vacDialogRoot [open]="open">
        <button vacDialogTrigger>Open Dialog</button>
        <ng-container *vacPortal="'parent'">
          <div *vacDialogOverlay></div>
          <div *vacDialogContent>
            <h2 vacDialogTitle >Dialog Title</h2>
            <p vacDialogDescription>This is the dialog content.</p>
            <div>
              <label for="email">Email</label>
              <div class="mt-2">
                <input type="email" name="email" id="email" placeholder="you@example.com"/>
              </div>
            </div>
            <button vacDialogClose aria-label="close">Close</button>
          </div>
        </ng-container>
      </div>
    `,
      {
        imports: [DialogPrimitivesModule, PortalDirective, NoopAnimationsModule],
        componentProperties: { open },
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
      },
    );
  };

  it('should create an accessible dialog', async () => {
    await setup({ open: true });
    expect(await axe(screen.getByRole('dialog'))).toHaveNoViolations();
  });

  it('should open the dialog when trigger button is clicked', async () => {
    const user = userEvent.setup();
    await setup();
    await user.click(screen.getByRole('button', { name: /open dialog/i }));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('should close the dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    await setup();
    await user.click(screen.getByRole('button', { name: /open dialog/i }));
    await user.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should focus the first focusable element when the dialog opens', async () => {
    const user = userEvent.setup();
    await setup();
    await user.click(screen.getByRole('button', { name: /open dialog/i }));
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveFocus();
  });
});
