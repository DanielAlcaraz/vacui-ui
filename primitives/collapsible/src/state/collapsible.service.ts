import { Injectable, signal } from '@angular/core';

@Injectable()
export class CollapsibleStateService {
  open = signal(false);
  disabled = signal(false);
  private contentId: string | null = null;

  getContentId() {
    if (this.contentId) return this.contentId;

    this.contentId = 'collapsible-' + Math.floor(Math.random() * 1000);
    return this.contentId;
  }

  toggleOpen() {
    if (!this.disabled()) {
      this.open.update(open => !open);
    }
  }
}
