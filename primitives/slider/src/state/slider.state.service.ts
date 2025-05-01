import { Injectable, signal } from '@angular/core';
import { generateRandomId, mutable } from '@vacui-ui/primitives/utils';

export interface Thumb {
  element: HTMLElement
}

@Injectable()
export class SliderStateService {
  min = signal(0);
  max = signal(100);
  step = signal(1);
  orientation = signal<'horizontal' | 'vertical'>('horizontal');
  disabled = signal(false);
  bigStepFactor = signal(10); // Apply a multiplier to the step for keyboard fast navigation
  name = signal(generateRandomId());
  minStepsBetweenThumbs = signal<number>(0);
  value = mutable<number[]>([]); // An array to support multiple thumbs
  inverted = signal(false);

  /* ELEMENTS */
  thumbs = mutable<Thumb[]>([]);
  trackElement!: HTMLElement;

  addThumb(thumb: Thumb) {
    this.thumbs.mutate(thumbs => {
      thumbs.push(thumb);
      return thumbs;
    });
  }
}
