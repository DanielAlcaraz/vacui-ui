import { Injectable, signal } from '@angular/core';
import { LoadingStatus } from '../models/avatar.models';

@Injectable()
export class AvatarStateService {
  loadingStatus = signal<LoadingStatus>('idle');
  imageSrc = signal<string | null>(null);

  loadImage(src: string): void {
    this.loadingStatus.set('loading');
    this.imageSrc.set(src);
  }

  setLoadingStatus(status: LoadingStatus): void {
    this.loadingStatus.set(status);
  }
}
