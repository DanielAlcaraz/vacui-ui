import { ValueEqualityFn, WritableSignal, computed } from '@angular/core';
import { MutableSignal, mutable } from '../mutable-signal/mutable-signal';

type StoreKey<T> = T extends object ? keyof T : never;

type StorePath<T> = T extends object ? [StoreKey<T>, ...StorePath<T[StoreKey<T>]>] : [];

type ResolvePathType<T, Path extends StorePath<T>> = Path extends []
  ? T // Base case:  Empty path, type is just T itself
  : Path extends [infer K, ...infer Rest]
    ? K extends keyof T
      ? Rest extends StorePath<T[K]>
        ? ResolvePathType<T[K], Rest>
        : never
      : never // Handle keys invalid for T
    : never;

type AssignableSignalStore<T> = MutableSignal<T> & {
  updateProp<K extends StorePath<T>>(path: K, value: ResolvePathType<T, K>): void;
};

export type SignalStore<T> = WritableSignal<T> & {
  updateProp<K extends StorePath<T>>(path: K, value: ResolvePathType<T, K>): void;
};

function createPropUpdater<T>(sig: MutableSignal<T>) {
  return <K extends StorePath<T>>(path: StorePath<T>, value: ResolvePathType<T, K>) => {
    sig.mutate((state) => {
      let obj = state as any;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      // Replace path.at(-1) with path[path.length - 1]
      obj[path[path.length - 1]] = value;
      return state;
    });
  };
}

function createStore<T>(value: T, opt?: { equal: ValueEqualityFn<T> }) {
  const sig = mutable(value, opt) as AssignableSignalStore<T>;
  sig.updateProp = createPropUpdater(sig);
  return sig;
}

export function store<T>(value: T, opt?: { equal: ValueEqualityFn<T> }): SignalStore<T> {
  return createStore(value, opt);
}

export type SlicedStore<T> = SignalStore<T> & {
  slices: {
    [K in keyof T]: Slice<T[K]>;
  };
};

type AssignableSlicedStore<T> = AssignableSignalStore<T> & {
  slices: {
    [K in keyof T]: AssignableSlice<T[K]>;
  };
};

type Slice<T> = T extends object ? (T extends null ? WritableSignal<T> : SlicedStore<T>) : WritableSignal<T>;
type AssignableSlice<T> = T extends object
  ? T extends null
    ? MutableSignal<T>
    : AssignableSlicedStore<T>
  : MutableSignal<T>;

function keys<T extends object>(obj: T): (keyof T)[] {
  if (!obj) return [];
  return Object.keys(obj) as (keyof T)[];
}

function slicedStoreWithParent<T extends object, K extends keyof T>(
  parentStore: AssignableSlicedStore<T>,
  key: K,
) {
  const value = parentStore()[key];
  if (typeof value !== 'object' || value === null) return null;

  const sig = computed(() => parentStore()[key]) as AssignableSlicedStore<typeof value>;

  sig.set = (value) => {
    parentStore.mutate((state) => {
      state[key] = value;
      return state;
    });
  };

  sig.update = (fn) => sig.set(fn(sig()));
  sig.mutate = (fn) => sig.set(fn(sig()));
  sig.updateProp = createPropUpdater(sig);

  sig.slices = keys(value).reduce(
    (acc, key) => {
      const sigVal = sig()[key];

      if (typeof sigVal === 'object' && sigVal !== null) {
        const subStore = slicedStoreWithParent(sig, key);
        if (subStore) acc[key] = subStore as (typeof acc)[typeof key];
        return acc;
      }

      const propSig = computed(() => sig()[key]) as AssignableSlice<typeof sigVal>;
      propSig.set = (value: typeof sigVal) => {
        sig.mutate((state) => {
          state[key] = value;
          return state;
        });
      };
      propSig.update = (fn: any) => propSig.set(fn(propSig()));
      propSig.mutate = (fn: any) => propSig.set(fn(propSig()));
      acc[key] = propSig as (typeof acc)[typeof key];

      return acc;
    },
    {} as typeof sig.slices,
  );

  return sig;
}

export function slicedStore<T extends object>(value: T, opt?: { equal: ValueEqualityFn<T> }): SlicedStore<T> {
  const sig = mutable(value, opt) as AssignableSlicedStore<T>;
  sig.updateProp = createPropUpdater(sig);

  sig.slices = keys(value).reduce(
    (acc, key) => {
      const sigVal = sig()[key];

      if (typeof sigVal === 'object' && sigVal !== null) {
        const subStore = slicedStoreWithParent(sig, key);
        if (subStore) acc[key] = subStore as (typeof acc)[typeof key];
        return acc;
      }

      const propSig = computed(() => sig()[key]) as AssignableSlice<typeof sigVal>;
      propSig.set = (value: typeof sigVal) => {
        sig.mutate((state) => {
          state[key] = value;
          return state;
        });
      };
      propSig.update = (fn: any) => propSig.set(fn(propSig()));
      propSig.mutate = (fn: any) => propSig.set(fn(propSig()));
      acc[key] = propSig as (typeof acc)[typeof key];

      return acc;
    },
    {} as typeof sig.slices,
  );

  return sig;
}
