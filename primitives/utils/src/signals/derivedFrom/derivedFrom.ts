import { Injector, computed, untracked, type Signal } from '@angular/core';

export type DerivedFromOptions<T> = {
  readonly injector?: Injector;
  readonly initialValue?: T | null;
};

type SignalInputTuple<T> = {
  [K in keyof T]: Signal<T[K]> | (() => T[K]);
};

export function derivedFrom<Input extends readonly unknown[], Output = Input>(
  sources: readonly [...SignalInputTuple<Input>],
  options?: DerivedFromOptions<Output>,
): Signal<Output>;

export function derivedFrom<Input extends object, Output = Input>(
  sources: SignalInputTuple<Input>,
  options?: DerivedFromOptions<Output>,
): Signal<Output>;

export function derivedFrom<Input = any, Output = Input>(...args: any[]): Signal<Output> {
  const { sources, options } = _normalizeArgs<Input, Output>(args);

  return computed(() => {
    const values = (Array.isArray(sources) ? sources : Object.values(sources)).map((source) =>
      typeof source === 'function' ? source() : untracked(source),
    );
    const result = options?.initialValue !== undefined ? options.initialValue : values;
    return result as Output;
  });
}

function _normalizeArgs<Input, Output>(
  args: any[],
): {
  sources: SignalInputTuple<Input>;
  options: DerivedFromOptions<Output> | undefined;
} {
  if (!args || !args.length || typeof args[0] !== 'object') {
    throw new TypeError('derivedFrom needs sources');
  }
  const sources = args[0];
  const options = args[1];

  return { sources, options };
}
