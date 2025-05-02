import { signal, WritableSignal } from '@angular/core';

export interface MapSignal<K, V> {
  get: (key: K) => V | undefined; // This should fetch a value by key
  update: (updater: (current: Map<K, V>) => Map<K, V>) => void;
  set: (key: K, value: V) => void;
  delete: (key: K) => boolean;
  clear: () => void;
}


export function mapSignal<K, V>(initial?: Iterable<readonly [K, V]>): MapSignal<K, V> {
  const internalMap = new Map<K, V>(initial);
  let trigger = false;

  const baseSignal: WritableSignal<Map<K, V>> = signal(new Map(internalMap), {
    equal: (a, b) => {
      if (trigger) return false;
      return a.size === b.size && Array.from(a.entries()).every(([key, val]) => b.get(key) === val);
    }
  });

  const updateMap = (updater: (current: Map<K, V>) => Map<K, V>) => {
    trigger = true;
    baseSignal.update(updater);
    trigger = false;
  };

  return {
    get: (key: K) => baseSignal().get(key),
    update: updateMap,
    set: (key: K, value: V) => updateMap(current => {
      current.set(key, value);
      return new Map(current);
    }),
    delete: (key: K) => {
      let result = false;
      updateMap(current => {
        result = current.delete(key);
        return new Map(current);
      });
      return result;
    },
    clear: () => updateMap(current => {
      current.clear();
      return new Map(current);
    })
  };
}
