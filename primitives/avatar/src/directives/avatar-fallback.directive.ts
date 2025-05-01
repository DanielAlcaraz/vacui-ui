import { Directive, PLATFORM_ID, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AvatarStateService } from '../state/avatar.service';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[vacAvatarFallback]',
  standalone: true,
  exportAs: 'vacAvatarFallback',
})
export class AvatarFallbackDirective {
  state = inject(AvatarStateService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private platform = inject(PLATFORM_ID);

  delayMs = input<any | number>(0, { alias: 'vacAvatarFallback' });

  private timerId!: ReturnType<typeof setTimeout> | null;
  private hasView = false;

  constructor() {
    effect(() => {
      const status = this.state.loadingStatus();
      if (status === 'loaded') {
        this.removeView();
      } else {
        if (isPlatformBrowser(this.platform) && this.delayMs() > 0) {
          this.showViewWithDelay(this.delayMs());
        } else if (this.delayMs() === 0) {
          this.showViewWithDelay(0);
        }
      }
    });
  }

  private showViewWithDelay(delayMs: number): void {
    this.removeView();

    if (delayMs > 0) {
      this.timerId = setTimeout(() => {
        this.createView();
      }, delayMs);
    } else {
      this.createView();
    }
  }

  private createView(): void {
    if (!this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
  }

  private removeView(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
