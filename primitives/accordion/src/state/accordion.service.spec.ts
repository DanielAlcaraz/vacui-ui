import { TestBed } from '@angular/core/testing';
import { AccordionStateService } from './accordion.service';
import { AccordionItem } from '../model/accordion.model';
import { ElementRef } from '@angular/core';

describe('AccordionService', () => {
  let service: AccordionStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccordionStateService]
    });
    service = TestBed.inject(AccordionStateService);
  });

  it('should add an item', () => {
    const item: AccordionItem = {
      id: 'test',
      value: 'Test Value',
      disabled: false,
      state: 'closed',
    };
    service.addItem(item);
    expect(service.itemsCount()).toBe(1);
  });

  it('should remove an item', () => {
    const item: AccordionItem = {
      id: 'test',
      value: 'Test Value',
      disabled: false,
      state: 'closed',
    };
    service.addItem(item);
    service.removeItem(item.id);
    expect(service.itemsCount()).toBe(0);
  });

  it('should open an item', () => {
    const item: AccordionItem = {
      id: 'test',
      value: 'Test Value',
      disabled: false,
      state: 'closed',
    };
    service.addItem(item);
    service.openItem(item.id);
    const updatedItem = service.getItem(item.id);
    expect(updatedItem?.state).toBe('open');
  });

  it('should open a disabled item when force is true', () => {
    service.addItem({ id: '1', value: 'Item 1', disabled: true, state: 'closed' });
    service.openItem('1', true);
    expect(service.getItem('1')?.state).toBe('open');
  });

  it('should open one item and close others when multiple is false', () => {
    service.multiple.set(false);
    service.addItem({ id: '1', value: 'Item 1', disabled: false, state: 'closed' });
    service.addItem({ id: '2', value: 'Item 2', disabled: false, state: 'closed' });

    service.openItem('1');
    expect(service.getItem('1')?.state).toBe('open');
    service.openItem('2');
    expect(service.getItem('1')?.state).toBe('closed');
    expect(service.getItem('2')?.state).toBe('open');
  });

  it('should open items independently when multiple is true', () => {
    service.multiple.set(true);
    service.addItem({ id: '1', value: 'Item 1', disabled: false, state: 'closed' });
    service.addItem({ id: '2', value: 'Item 2', disabled: false, state: 'closed' });

    service.openItem('1');
    expect(service.getItem('1')?.state).toBe('open');
    service.openItem('2');
    expect(service.getItem('1')?.state).toBe('open');
    expect(service.getItem('2')?.state).toBe('open');
  });

  it('should not open a disabled item', () => {
    service.addItem({ id: '1', value: 'Item 1', disabled: true, state: 'closed' });
    service.openItem('1');
    expect(service.getItem('1')?.state).toBe('closed');
  });

  it('should close an item', () => {
    const item: AccordionItem = {
      id: 'test',
      value: 'Test Value',
      disabled: false,
      state: 'open',
    };
    service.addItem(item);
    service.closeItem(item.id);
    const updatedItem = service.getItem(item.id);
    expect(updatedItem?.state).toBe('closed');
  });

  it('should close a non-collapsible item when force is true', () => {
    service.multiple.set(false);
    service.collapsible.set(false);
    service.addItem({ id: '1', value: 'Item 1', disabled: false, state: 'open' });
    service.closeItem('1', true);
    expect(service.getItem('1')?.state).toBe('closed');
  });

  it('should not close the only open item if collapsible is false and multiple is false', () => {
    service.multiple.set(false);
    service.collapsible.set(false);
    service.addItem({ id: 'test', value: 'Test Value', disabled: false, state: 'open' });
    service.closeItem('test');
    expect(service.getItem('test')?.state).toBe('open');
  });

  it('should allow closing other items when multiple items are open, even if collapsible is false', () => {
    service.multiple.set(false);
    service.collapsible.set(false);
    service.addItem({ id: 'test1', value: 'Test Value 1', disabled: false, state: 'open' });
    service.addItem({ id: 'test2', value: 'Test Value 2', disabled: false, state: 'open' });
    service.closeItem('test1');
    expect(service.getItem('test1')?.state).toBe('closed');
    expect(service.getItem('test2')?.state).toBe('open');
  });

  it('should toggle an item', () => {
    const item: AccordionItem = {
      id: 'test',
      value: 'Test Value',
      disabled: false,
      state: 'closed',
    };
    service.addItem(item);
    service.toggleItem(item.id);
    const updatedItem = service.getItem(item.id);
    expect(updatedItem?.state).toBe('open');
    service.toggleItem(item.id);
    const toggledItem = service.getItem(item.id);
    expect(toggledItem?.state).toBe('closed');
  });

  it('should toggle a disabled item when force is true', () => {
    service.addItem({ id: '1', value: 'Item 1', disabled: true, state: 'closed' });
    service.toggleItem('1', true);
    expect(service.getItem('1')?.state).toBe('open');
    service.toggleItem('1', true);
    expect(service.getItem('1')?.state).toBe('closed');
  });

  it('should not toggle a disabled item', () => {
    const item: AccordionItem = {
      id: 'disabled-item',
      value: 'Disabled Item',
      disabled: true,
      state: 'closed',
    };
    service.addItem(item);
    service.toggleItem('disabled-item');

    expect(service.getItem('disabled-item')?.state).toBe('closed');
  });

  it('should generate correct ID for trigger', () => {
    const generatedId = service.generateAriaControlId('1', 'test', 'trigger');
    expect(generatedId).toBe('t-1-test-trigger');
  });

  it('should generate correct ID for panel', () => {
    const generatedId = service.generateAriaControlId('1', 'test', 'panel');
    expect(generatedId).toBe('p-1-test-panel');
  });

  it('should update the configuration', () => {
    service.multiple.set(true);
    service.collapsible.set(false);

    const { multiple, collapsible } = service.getConfig();
    expect(multiple).toBe(true);
    expect(collapsible).toBe(false);
  });

  it('should handle opening multiple items correctly when multiple is true', () => {
    const item1: AccordionItem = { id: '1', value: 'Item 1', disabled: false, state: 'closed' };
    const item2: AccordionItem = { id: '2', value: 'Item 2', disabled: false, state: 'closed' };
    service.addItem(item1);
    service.addItem(item2);

    service.multiple.set(true);
    service.openItem('1');
    service.openItem('2');

    expect(service.getItem('1')?.state).toBe('open');
    expect(service.getItem('2')?.state).toBe('open');
    expect(service.itemsCount()).toBe(2);
  });

  it('should close all items', () => {
    service.addItem({ id: '1', value: 'Item 1', disabled: false, state: 'open' });
    service.addItem({ id: '2', value: 'Item 2', disabled: false, state: 'open' });

    service.closeAllItems();

    expect(service.getItem('1')?.state).toBe('closed');
    expect(service.getItem('2')?.state).toBe('closed');
  });

  it('should not throw error if trying to operate on a non-existent item', () => {
    expect(() => service.openItem('nonexistent')).not.toThrow();
    expect(() => service.closeItem('nonexistent')).not.toThrow();
    expect(() => service.toggleItem('nonexistent')).not.toThrow();
  });

  it('should determine if an item is initially open based on the value', () => {
    service.value.set(['item1']);
    expect(service.isInitiallyOpen('item1')).toBe(true);
    expect(service.isInitiallyOpen('item2')).toBe(false);
  });

  it('should retrieve all triggers', () => {
    const mockElementRef = {} as ElementRef;
    service.bindTrigger('item1', mockElementRef);
    expect(service.getTriggers()).toEqual([['item1', mockElementRef]]);
  });

  it('should bind and then remove a trigger', () => {
    const mockElementRef = {} as ElementRef;
    service.bindTrigger('item1', mockElementRef);
    expect(service.getTriggers().length).toBe(1);
    service.removeTrigger('item1');
    expect(service.getTriggers().length).toBe(0);
  });

  it('should return true if the item is open', () => {
    service.addItem({ id: '1', value: 'Item 1', disabled: false, state: 'open' });
    expect(service.isActive('Item 1')).toBe(true);
  });

  it('should return false if the item is closed', () => {
    service.addItem({ id: '2', value: 'Item 2', disabled: false, state: 'closed' });
    expect(service.isActive('Item 2')).toBe(false);
  });
});
