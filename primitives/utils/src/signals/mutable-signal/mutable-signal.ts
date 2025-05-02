import { ValueEqualityFn, WritableSignal, signal } from '@angular/core';

export type MutableSignal<T> = WritableSignal<T> & {
  mutate: WritableSignal<T>['update'];
};

export function mutable<T>(initial: T, opts?: { equal?: ValueEqualityFn<T> }) {
  const baseEqual = opts?.equal ?? Object.is;
  let trigger = false;

  const equal: ValueEqualityFn<T> = (a, b) => {
    if (trigger) return false;
    return baseEqual(a, b);
  };

  const sig = signal(initial, { equal }) as MutableSignal<T>;
  sig.mutate = (fn: (v: T) => T) => {
    trigger = true;
    sig.update(fn);
    trigger = false;
  };

  return sig;
}
