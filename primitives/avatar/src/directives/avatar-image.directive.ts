import { Directive, ElementRef, effect, inject, input, output, untracked } from '@angular/core';
import { AvatarStateService } from '../state/avatar.service';
import { LoadingStatus } from '../models/avatar.models';

@Directive({
  selector: '[vacAvatarImage]',
  exportAs: 'vacAvatarImage',
  standalone: true,
})
export class AvatarImageDirective {
  private state = inject(AvatarStateService);
  private element = inject(ElementRef<HTMLImageElement>).nativeElement;

  src = input.required<string>();
  loadingStatusChange = output<LoadingStatus>();

  constructor() {
    effect(() => {
      const status = this.state.loadingStatus();
      this.loadingStatusChange.emit(status);
      this.element.style.display = status === 'loaded' ? 'block' : 'none';
    });

    effect(() => {
      const newSrc = this.src();
      untracked(() => {
        this.state.setLoadingStatus('loading');
        this.loadImage(newSrc);
      });
    });
  }

  private loadImage(src: string) {
    this.state.loadImage(src);
    this.element.src = src;

    this.element.onload = () => untracked(() => this.state.setLoadingStatus('loaded'));
    this.element.onerror = () => untracked(() => this.state.setLoadingStatus('error'));
  }
}