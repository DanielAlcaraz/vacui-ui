import { AfterContentInit, Directive, HostListener, effect, inject, input, model } from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { ToggleGroupStateService } from '../state/toggle-group-state.service';

@Directive({
  selector: '[vacToggleGroupRoot]',
  standalone: true,
  exportAs: 'vacToggleGroupRoot',
  providers: [ToggleGroupStateService],
  host: { role: 'group' },
})
export class ToggleGroupRootDirective implements AfterContentInit {
  state = inject(ToggleGroupStateService);

  type = input<'single' | 'multiple'>('single');
  disabled = input(false);
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  rovingFocus = input(true);
  loop = input(false);
  value = model<string[] | string | null>(null);

  constructor() {
    hostBinding('attr.data-orientation', this.orientation);
  }

  ngAfterContentInit() {
    this.state.items().forEach((item) => {
      item.toggle.subscribe(() => {
        if (this.type() === 'single') {
          this.value.set(item.pressed() ? item.value() : null);
          this.state.items().forEach((i) => i.pressed.set(i === item && item.pressed()));
        } else {
          const arrValue = Array.isArray(this.value()) ? (this.value() as string[]) : [];
          const value = arrValue.includes(item.value())
            ? arrValue.filter((v) => v !== item.value())
            : [...arrValue, item.value()];
          this.value.set(value);
        }
      });
    });
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.rovingFocus()) return;

    const keyHandlers: { [key: string]: (event: KeyboardEvent) => void } = {
      Enter: this.toggleCurrentItem,
      ' ': this.toggleCurrentItem,
      Home: this.focusFirstItem,
      End: this.focusLastItem,
      ArrowLeft: this.moveFocus,
      ArrowRight: this.moveFocus,
      ArrowUp: this.moveFocus,
      ArrowDown: this.moveFocus,
    };

    const handler = keyHandlers[event.key];
    if (handler) {
      handler.call(this, event);
    }
  }

  toggleCurrentItem(event: KeyboardEvent) {
    const currentItem = this.state.items()[this.getFocusedItemIndex()];
    currentItem.onClick();
    event.preventDefault();
  }

  focusFirstItem(event: KeyboardEvent) {
    this.state.items()[0].focus();
    event.preventDefault();
  }

  focusLastItem(event: KeyboardEvent) {
    this.state.items()[this.state.items().length - 1].focus();
    event.preventDefault();
  }

  moveFocus(event: KeyboardEvent) {
    if (!this.rovingFocus()) return;
    const currentIndex = this.getFocusedItemIndex();
    let nextIndex = this.calculateNextIndex(event.key, currentIndex);

    while (nextIndex !== -1 && this.state.items()[nextIndex].disabled()) {
      nextIndex = this.calculateNextIndex(event.key, nextIndex);
    }

    if (nextIndex !== -1) {
      this.state.items()[nextIndex].focus();
      event.preventDefault();
    }
  }

  getFocusedItemIndex(): number {
    return this.state.items().findIndex((item) => item.isFocused());
  }

  private calculateNextIndex(key: string, currentIndex: number): number {
    const maxIndex = this.state.items().length - 1;
    const isHorizontal = this.orientation() === 'horizontal';
    const mappings: { [key: string]: number } = {
      ArrowLeft: isHorizontal ? -1 : 0,
      ArrowRight: isHorizontal ? 1 : 0,
      ArrowUp: isHorizontal ? 0 : -1,
      ArrowDown: isHorizontal ? 0 : 1,
    };

    const step = mappings[key];
    if (step === undefined) return -1;

    const proposedIndex = currentIndex + step;
    if (proposedIndex >= 0 && proposedIndex <= maxIndex) return proposedIndex;

    if (this.loop()) {
      return proposedIndex < 0 ? maxIndex : 0;
    }

    return -1;
  }
}
