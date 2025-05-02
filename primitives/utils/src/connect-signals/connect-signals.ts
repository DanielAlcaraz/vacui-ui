import { effect, untracked, Injector, OutputEmitterRef, WritableSignal, runInInjectionContext, inject } from '@angular/core';

/**
 * Connects one writable signal to another, propagating changes from the source to the target.
 * Optionally emits an event through an OutputEmitterRef when the target signal is updated independently.
 * Ensures that the src update does not trigger an unintended emit.
 *
 * @param src Source signal to fetch the value from.
 * @param dest Destination writable signal to be updated.
 * @param output Optional emitter to trigger when the destination is updated independently.
 * @param injector Optional Injector for context-specific dependency injection.
 */
export function connectSignals<T>(
  src: () => T,
  dest: WritableSignal<T>,
  output?: OutputEmitterRef<T> | null,
  injector?: Injector,
): void {
  runInInjectionContext(injector ?? inject(Injector), () => {
    let lastSrcValue: T | undefined;
    let lastEmittedValue: T | undefined;
    let initialized = false; // Track if the destination signal has been initialized

    // Set up an effect to sync the source to the destination
    effect(() => {
      const srcValue = src();
      if (srcValue !== lastSrcValue) {
        untracked(() => {
          dest.set(srcValue);
          lastSrcValue = srcValue; // Update the last known source value after setting dest
        });
      }
    });

    // Conditionally set up a secondary effect if an output is provided
    if (output) {
      effect(() => {
        const currentDestValue = dest();
        if (initialized && currentDestValue !== lastEmittedValue) {
          output.emit(currentDestValue);
          lastEmittedValue = currentDestValue; // Update last emitted after emitting
        }
        initialized = true; // Mark as initialized after the first effect run
      });
    }
  });
}
