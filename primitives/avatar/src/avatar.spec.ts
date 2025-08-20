import { Component } from '@angular/core';
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { AvatarRootDirective } from '../src/directives/avatar-root.directive';
import { AvatarImageDirective } from '../src/directives/avatar-image.directive';
import { AvatarFallbackDirective } from '../src/directives/avatar-fallback.directive';
import { AvatarStateService } from '../src/state/avatar.service';

@Component({
  standalone: false,
  template: `
    <div vacAvatarRoot class="avatar-container">
      <img
        vacAvatarImage
        [src]="imageSrc"
        alt="Avatar"
        (loadingStatusChange)="onLoadingStatusChange($event)"
      />
      <div *vacAvatarFallback="fallbackDelay" class="fallback">
        {{ fallbackContent }}
      </div>
    </div>
  `,
})
class TestComponent {
  imageSrc = 'https://example.com/avatar.jpg';
  fallbackDelay = 0;
  fallbackContent = 'FB';
  onLoadingStatusChange = jest.fn();
}

describe('Avatar Directives', () => {
  const setupComponent = async (props: Partial<TestComponent> = {}) => {
    return await render(TestComponent, {
      componentProperties: props,
      imports: [AvatarRootDirective, AvatarImageDirective, AvatarFallbackDirective],
      providers: [AvatarStateService],
    });
  };

  it('should create an accessible avatar', async () => {
    const { container } = await setupComponent();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render the image when loaded successfully in browser', async () => {
    const { fixture } = await setupComponent();
    const img = screen.getByAltText('Avatar') as HTMLImageElement;

    // Simulate successful image load
    fireEvent.load(img);

    await waitFor(() => {
      expect(img.style.display).toBe('block');
    });
    expect(screen.queryByText('FB')).not.toBeInTheDocument();
  });

  it('should show fallback when image fails to load in browser', async () => {
    const { fixture } = await setupComponent();
    const img = screen.getByAltText('Avatar') as HTMLImageElement;

    // Simulate image load error
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByText('FB')).toBeVisible();
    });
  });

  it('should emit loading status changes', async () => {
    const { fixture } = await setupComponent();
    const component = fixture.componentInstance;
    const img = screen.getByAltText('Avatar') as HTMLImageElement;

    // Check initial 'loading' status
    expect(component.onLoadingStatusChange).toHaveBeenCalledWith('loading');

    // Simulate successful image load
    fireEvent.load(img);

    await waitFor(() => {
      expect(component.onLoadingStatusChange).toHaveBeenCalledWith('loaded');
    });

    // Simulate image load error
    fireEvent.error(img);

    await waitFor(() => {
      expect(component.onLoadingStatusChange).toHaveBeenCalledWith('error');
    });
  });

  it('should handle empty image source', async () => {
    const { fixture } = await setupComponent({ imageSrc: '' });
    const img = screen.getByAltText('Avatar') as HTMLImageElement;

    // Simulate image load error for empty source
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByText('FB')).toBeVisible();
    });
  });

  it('should update image source dynamically', async () => {
    const { fixture } = await setupComponent();
    const img = screen.getByAltText('Avatar') as HTMLImageElement;

    expect(img.src).toBe('https://example.com/avatar.jpg');

    fixture.componentInstance.imageSrc = 'https://example.com/new-avatar.jpg';
    fixture.detectChanges();

    await waitFor(() => {
      expect(img.src).toBe('https://example.com/new-avatar.jpg');
    });
  });

  it('should handle SSR environment', async () => {
    await setupComponent();
    const img = screen.getByAltText('Avatar') as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.style.display).toBe('none');

    waitFor(() => {
      expect(screen.getByText('FB')).toBeInTheDocument();
    });
  });
});
