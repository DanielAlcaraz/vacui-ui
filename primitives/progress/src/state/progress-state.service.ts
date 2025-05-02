import { Injectable, computed, signal } from '@angular/core';

@Injectable()
export class ProgressStateService {
  value = signal<number | null>(null);
  max = signal<number>(100);
  getProgressState = computed(() => {
    return this.value() == null ? 'indeterminate' : this.value() === this.max() ? 'complete' : 'loading';
  });
}
