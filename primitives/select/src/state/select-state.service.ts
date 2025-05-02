import { Injectable, computed, signal } from '@angular/core';
import { generateRandomId, mutable } from '@vacui-kit/primitives/utils';
import { Item, SelectValue } from '../model/select.model';

@Injectable()
export class SelectStateService<T = string> {
  open = signal(false);
  disabled = signal(false);
  required = signal(false);
  multiple = signal(false);
  selectedValues = mutable<T[]>([]);
  compareWith = (o1: SelectValue<T>, o2: SelectValue<T>) => o1 === o2;
  items = mutable<Item<T>[]>([]);
  triggerElement!: HTMLElement;
  highlighted = signal<SelectValue<T>>(null);
  onEscapeKeyDown: ((event: KeyboardEvent) => void) | null = null;

  /* ATTRS */
  dataState = computed(() => this.open() ? 'open' : 'closed');
  ariaControls = signal(generateRandomId());

  toggleOpening() {
    this.open.update((value) => !value);
  }

  toggleSelection(value: T): void {
    if (this.isSelected(value)) {
      this.removeSelectedValue(value);
    } else {
      if (this.multiple()) {
        this.addSelectedValue(value);
      } else {
        this.selectedValues.set([value]);
      }
    }
  }

  addInstance(item: Item<T>) {
    this.items.mutate((items) => {
      const itemIndex = items.findIndex(({ value }) => item.value === value);
      if (itemIndex > -1) {
        items[itemIndex] = item;
      } else {
        items.push(item);
      }
      return items;
    });
  }

  removeInstance(value: T) {
    this.items.mutate((items) => {
      return items.filter((selectedItem) => !this.compareWith(selectedItem.value, value));
    });
  }

  findLabelByValue(value: T) {
    return this.items().find((instance) => this.compareWith(instance.value, value))?.label || '';
  }

  isSelected(value: SelectValue<T>): boolean {
    return this.selectedValues().some((selectedItem) => this.compareWith(selectedItem, value));
  }

  addSelectedValue(value: SelectValue<T>) {
    if (!value) return;
    this.selectedValues.mutate((values) => {
      if (Array.isArray(value)) {
        const uniqueValues = value.filter(
          (v) => !values.some((selectedItem) => this.compareWith(selectedItem, v)),
        );
        values.push(...uniqueValues);
      } else {
        if (!values.some((selectedItem) => this.compareWith(selectedItem, value))) {
          values.push(value);
        }
      }

      return values;
    });
  }

  private removeSelectedValue(value: T) {
    if (this.isSelected(value)) {
      this.selectedValues.mutate((items) => {
        return items.filter((selectedItem) => !this.compareWith(selectedItem, value));
      });
    }
  }

  // TODO: create directive to add to a button and clear selection
  /* 
  clearSelection(): void {
    const removedItems = [...this.selectedItems];
    this.selectedItems = [];
    this.emitChanges([], removedItems);
  }
¡*/
}
