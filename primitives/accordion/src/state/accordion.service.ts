import { ElementRef, Injectable, computed, signal } from '@angular/core';
import { AccordionConfig, AccordionItem, AccordionOrientation, AccordionValue } from '../model/accordion.model';
import { mutable } from '@vacui-kit/primitives/utils';

@Injectable()
export class AccordionStateService {
  readonly items = mutable<AccordionItem[]>([]);
  readonly itemsCount = computed(() => this.items().length);

  // CONFIG
  readonly multiple = signal<boolean>(false);
  /**
   * Allows closing the items when we click in the trigger.
   */
  readonly collapsible = signal(true);
  readonly disabled = signal(false);
  readonly value = signal<AccordionValue>([]);
  readonly orientation = signal<AccordionOrientation>('vertical');

  // INTERN
  private _triggers = new Map<string, ElementRef>();

  getConfig(): AccordionConfig {
    return {
      multiple: this.multiple(),
      collapsible: this.collapsible(),
      disabled: this.disabled(),
      value: this.value(),
      orientation: this.orientation(),
    };
  }

  isActive(id: string): boolean {
    return this.items().find((i) => i.value === id)?.state === 'open' ? true : false;
  }

  isInitiallyOpen(itemId: string): boolean {
    return this.value()?.includes(itemId) ?? false;
  }

  addItem(item: AccordionItem) {
    this.items.update((items) => [...items, item]);
  }

  getTriggers() {
    return Array.from(this._triggers);
  }

  bindTrigger(itemId: string, trigger: ElementRef<HTMLElement>) {
    this._triggers.set(itemId, trigger);
  }

  removeTrigger(itemId: string) {
    this._triggers.delete(itemId);
  }

  removeItem(id: string) {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  openItem(id: string, force = false) {
    if (this.disabled() && !force) return;

    this.items.update((items) =>
      items.map((item) => {
        if (item.id === id && (!item.disabled || force)) {
          return { ...item, state: 'open' };
        } else if (!this.multiple() && item.state === 'open' && !force) {
          return { ...item, state: 'closed' };
        }
        return item;
      }),
    );
  }

  closeItem(id: string, force = false) {
    if (this.disabled() && !force) return;

    // When single selection and force is not active
    if (!this.multiple() && !this.collapsible() && !force) {
      const openItems = this.items().filter((item) => item.state === 'open');
      if (openItems.length === 1 && openItems[0].id === id) {
        return;
      }
    }

    this.items.update((items) =>
      items.map((item) => {
        if (item.id === id && (!item.disabled || force)) return { ...item, state: 'closed' };
        return item;
      }),
    );
  }

  toggleItem(id: string, force = false) {
    if (this.disabled() && !force) return;

    const currentItem = this.items().find((item) => item.id === id);
    if (!currentItem || (currentItem.disabled && !force)) return;

    if (currentItem.state === 'open') {
      this.closeItem(id, force);
    } else {
      this.openItem(id, force);
    }
  }

  closeAllItems() {
    this.items.update((items) => items.map((item) => ({ ...item, state: 'closed' })));
  }

  getItem(id: string): AccordionItem | null {
    return this.items().find((item) => item.id === id) || null;
  }

  generateAriaControlId(uniqueId: string, value: string, type: 'trigger' | 'panel'): string {
    const prefix = type === 'trigger' ? 't' : 'p';
    return `${prefix}-${uniqueId}-${value}-${type}`;
  }
}
