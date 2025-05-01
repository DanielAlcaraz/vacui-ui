import { ElementRef, Injectable, Renderer2, effect, inject, signal } from '@angular/core';
import { FocusCallback, NavigationDirection, Rule, RuleCallback } from '../models/keyboard-navigation.model';

interface Item {
  id: string;
  element: ElementRef<HTMLElement>;
  disabled: boolean;
  startFocus: boolean;
}

@Injectable()
export class KeyboardNavigationService {
  disabled = signal(false);
  direction = signal<NavigationDirection>('vertical');
  customRules = signal<Rule[]>([]);
  tabNavigation = true;
  loop = true;
  rememberLastFocused = true;
  focusCallback: FocusCallback = null;
  highlightCallback: FocusCallback = null;
  mode = signal<'focus' | 'highlight'>('focus');

  lastFocusedIndex = 0;
  private rules: Map<string, Rule> = new Map();
  private renderer = inject(Renderer2);
  private elements: Item[] = [];

  constructor() {
    effect(() => {
      this.addRules(this.customRules(), this.direction());
    });
  }

  private addRules(customRules: Rule[], direction: NavigationDirection) {
    const rules = [...this.getDefaultNavigationRules(direction), ...customRules];

    for (const rule of rules) {
      const key = rule.key;
      if (key) {
        const existingRule = this.rules.get(key);
        const newCallback: RuleCallback = () => {
          existingRule?.callback();
          rule.callback();
        };

        this.rules.set(
          key,
          rule.override || !existingRule ? rule : { ...existingRule, callback: newCallback },
        );
      }
    }
  }

  addElement(item: Item) {
    if (this.elements.some((el) => item.id === el.id)) return;
    const index = this.findInsertIndex(item.element);
    this.elements.splice(index, 0, item);
    if (this.lastFocusedIndex === 0) {
      this.resetFocus();
    } else if (this.lastFocusedIndex >= index) {
      this.trackFocus(this.lastFocusedIndex + 1);
    } else {
      this.trackFocus(this.lastFocusedIndex);
    }
  }

  updateElement(id: string, disabled: boolean, startFocus: boolean) {
    const index = this.elements.findIndex((el) => el.id === id);
    if (index > -1) {
      this.elements[index].disabled = disabled;
      // We didn't move focus yet, so we need to recalculate the main focus.
      if (this.lastFocusedIndex === 0) {
        this.elements[index].startFocus = startFocus;
        this.resetFocus();
      }
    }
  }

  removeElement(id: string) {
    const index = this.elements.findIndex((el) => el.id === id);
    if (index === -1) return;
    this.elements.splice(index, 1);
  }

  resetFocus(hardReset = false) {
    const initFocusIndex = this.elements.findIndex((el) => el.startFocus);
    this.trackFocus(!hardReset && initFocusIndex > -1 ? initFocusIndex : 0);
  }

  setFocus(newIndex: number) {
    const item = this.elements[newIndex];
    item.element.nativeElement.focus();
    item.startFocus = false;
    this.trackFocus(newIndex);
  }

  private trackFocus(newIndex: number) {
    this.lastFocusedIndex = newIndex;
    if (this.tabNavigation) return;
    this.elements.forEach((el, index) => {
      this.renderer.setAttribute(el.element.nativeElement, 'tabindex', this.mode() === 'focus' && index === newIndex ? '0' : '-1');
    });
  }

  handleClick(id: string) {
    const index = this.elements.findIndex((item) => item.id === id);
    if (this.elements[index].disabled || this.disabled()) return;
    this.lastFocusedIndex = index;
    if (this.tabNavigation || this.mode() === 'highlight') return;
    this.elements.forEach((el, i) =>
      this.renderer.setAttribute(el.element.nativeElement, 'tabindex', i === index ? '0' : '-1'),
    );
  }

  handleKeydown(event: KeyboardEvent) {
    const rule = this.rules.get(event.key);
    if (!rule) return;
    event.preventDefault();
    rule.callback();
  }

  private getDefaultNavigationRules(direction: NavigationDirection): Rule[] {
    const next = direction === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prev = direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    return [
      { key: 'Home', callback: () => this.focusEdgeItem('Home') },
      { key: 'End', callback: () => this.focusEdgeItem('End') },
      { key: next, callback: () => this.focusDirectionalItem(next) },
      { key: prev, callback: () => this.focusDirectionalItem(prev) },
    ];
  }

  private focusEdgeItem(key: string): void {
    const index = key === 'Home' ? 0 : this.elements.length - 1;
    this.focusItemAtValidIndex(index);
  }

  private focusDirectionalItem(key: string): void {
    const step = ['ArrowDown', 'ArrowRight'].includes(key) ? 1 : -1;
    const  newIndex = (this.lastFocusedIndex + step + this.elements.length) % this.elements.length;
    if (!this.loop && this.reachesBoundary(newIndex, step)) return;
    this.focusItemAtValidIndex(newIndex, step);
  }

  private focusItemAtValidIndex(index: number, step = 0): void {
    index = this.getNearestValidIndex(index, step);
    if (this.elements[index].disabled) return;
    this.updateFocus(index);
  }

  private reachesBoundary(index: number, step: number): boolean {
    return (step === 1 && index === 0) || (step === -1 && index === this.elements.length - 1);
  }

  private getNearestValidIndex(index: number, step: number): number {
    let attempts = 0;
    while (this.elements[index].disabled && attempts < this.elements.length) {
      if (!this.loop && this.reachesBoundary(index, step)) break;
      index = (index + step + this.elements.length) % this.elements.length;
      attempts++;
    }
    return index;
  }
  
  private updateFocus = (newIndex: number) => {
    const item = this.elements[newIndex];
    if (this.mode() === 'focus') {
      item.element.nativeElement.focus();
      item.startFocus = false;
      this.focusCallback?.(newIndex, item.element.nativeElement);
    } else {
      this.highlightCallback?.(newIndex, item.element.nativeElement);
    }
    this.trackFocus(newIndex);
  };
    
  /**
   * Determines the index at which to insert the new element based on the DOM order
   */
  private findInsertIndex(newEl: ElementRef): number {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.comparePosition(newEl.nativeElement, this.elements[i].element.nativeElement) < 0) {
        return i;
      }
    }
    return this.elements.length; // If not found, insert at the end
  }

  private comparePosition(a: HTMLElement, b: HTMLElement): number {
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1;
    }
    return 0;
  }
}