export type SelectValue<T> = T | T[] | null;
export type SelectCompareWith<T> = (v1: T | null, v2: T | null) => boolean;
export interface Item<T> {
  value: T;
  label: string;
  disabled: boolean;
  element: HTMLElement;
}
