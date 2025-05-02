import { signal, computed, ElementRef } from '@angular/core';
import { AccordionItem, AccordionOrientation, AccordionState } from '../model/accordion.model';

export function createMockAccordionService() {
  const items = signal<AccordionItem[]>([]);
  const itemsCount = computed(() => items().length);
  const multiple = signal(false);
  const collapsible = signal(true);
  const disabled = signal(false);
  const value = signal<string | string[]>([]);
  const orientation = signal<AccordionOrientation>('vertical');
  const _triggers = new Map<string, ElementRef>();

  return {
    items,
    itemsCount,
    multiple,
    collapsible,
    disabled,
    value,
    orientation,

    getConfig: jest.fn(() => ({
      multiple: multiple(),
      collapsible: collapsible(),
      disabled: disabled(),
      value: value(),
      orientation: orientation(),
    })),

    isActive: jest.fn((id: string) => items().find((i) => i.value === id)?.state === 'open'),

    isInitiallyOpen: jest.fn((itemId: string) => value().includes(itemId)),

    addItem: jest.fn((item: AccordionItem) => items.update((currentItems) => [...currentItems, item])),

    getTriggers: jest.fn(() => Array.from(_triggers.entries())),

    bindTrigger: jest.fn((itemId: string, trigger: ElementRef) => {
      _triggers.set(itemId, trigger);
    }),

    removeTrigger: jest.fn((itemId: string) => {
      _triggers.delete(itemId);
    }),

    removeItem: jest.fn((id: string) => {
      items.update((currentItems) => currentItems.filter((item) => item.id !== id));
    }),

    openItem: jest.fn((id: string, force = false) => {
      if (disabled() && !force) return;
      items.update((currentItems) =>
        currentItems.map((item) => {
          if (item.id === id && (!item.disabled || force)) {
            return { ...item, state: 'open' };
          } else if (!multiple() && item.state === 'open' && !force) {
            return { ...item, state: 'closed' };
          }
          return item;
        }),
      );
    }),

    closeItem: jest.fn((id: string, force = false) => {
      if (disabled() && !force) return;
      if (!multiple() && !collapsible() && !force) {
        const openItems = items().filter((item) => item.state === 'open');
        if (openItems.length === 1 && openItems[0].id === id) {
          return;
        }
      }
      items.update((currentItems) =>
        currentItems.map((item) => {
          if (item.id === id && (!item.disabled || force)) {
            return { ...item, state: 'closed' };
          }
          return item;
        }),
      );
    }),

    toggleItem: jest.fn(function (id: string, force = false) {
      if (disabled() && !force) return;
      const currentItem = items().find((item) => item.id === id);
      if (!currentItem || (currentItem.disabled && !force)) return;
      if (currentItem.state === 'open') {
        this.closeItem(id, force);
      } else {
        this.openItem(id, force);
      }
    }),

    closeAllItems: jest.fn(() => {
      items.update((currentItems) => currentItems.map((item) => ({ ...item, state: 'closed' })));
    }),

    getItem: jest.fn((id: string) => {
      return items().find((item) => item.id === id) || null;
    }),

    generateAriaControlId: jest.fn((uniqueId: string, value: string, type: 'trigger' | 'panel') => {
      const prefix = type === 'trigger' ? 't' : 'p';
      return `${prefix}-${value}-${type}`;
    }),

    _triggers,
  };
}
