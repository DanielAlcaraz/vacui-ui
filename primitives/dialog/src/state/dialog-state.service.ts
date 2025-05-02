import { Injectable, computed, signal } from '@angular/core';
import { generateRandomId } from '@vacui-kit/primitives/utils';

@Injectable()
export class DialogStateService {
  open = signal(false);
  modal = signal(true);

  contentId = generateRandomId();
  titleId = generateRandomId();
  descriptionId = generateRandomId();

  dataState = computed(() => (this.open() ? 'open' : 'closed'));
}
