import { WritableSignal, Injector, inject, runInInjectionContext, untracked } from '@angular/core';
import { store } from '../store/store';

export function mergeFrom<T>(
  signals: Array<WritableSignal<T>>,
  options?: { injector: Injector },
): WritableSignal<T | null> {
  const mergedSignal: WritableSignal<T | null> = store(null);
  if (signals.length) {
    runInInjectionContext(options?.injector ?? inject(Injector), () => {
      const cloneValue = (value: T) => JSON.parse(JSON.stringify(value));

      // A signal that holds the latest emitted value
      let latestValue = cloneValue(signals[0]());
      untracked(() => mergedSignal.set(latestValue));

      // Override the 'set' method of each source signal to also update the merged signal
      signals.forEach((sig, index) => {
        const originalSet = sig.set;
        sig.set = function (newValue) {
          originalSet.call(this, newValue);
          untracked(() => mergedSignal.set(cloneValue(newValue)));
        };
      });
    });
  }

  return mergedSignal;
}
