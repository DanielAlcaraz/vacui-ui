import { Directive, ElementRef, HostListener, computed, inject } from '@angular/core';
import { hostBinding, isNavigationKey, isSelectionKey } from '@vacui-kit/primitives/utils';
import { SelectStateService } from '../state/select-state.service';
import { SelectRootDirective } from './select-root.directive';

@Directive({
  selector: '[vacSelectTrigger]',
  standalone: true,
  exportAs: 'vacSelectTrigger',
  host: { role: 'combobox', 'aria-autocomplete': 'none' },
})
export class SelectTriggerDirective {
  state = inject(SelectStateService);
  private element = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private searchTerm = '';
  private debounceTimeout!: ReturnType<typeof setTimeout>;
  private root = inject(SelectRootDirective);

  constructor() {
    this.state.triggerElement = this.element;
    hostBinding('attr.aria-expanded', this.state.open);
    hostBinding('attr.aria-controls', this.state.ariaControls);
    hostBinding('attr.aria-disabled', this.state.disabled);
    hostBinding('disabled', this.state.disabled);
    hostBinding('attr.data-state', this.state.dataState);
    hostBinding('attr.data-disabled', computed(() => this.state.disabled() ?? null));
    hostBinding('attr.aria-required', this.state.required);
    hostBinding('required', this.state.required);
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (this.state.open()) {
      if(event.key === 'Escape') {
        this.state.onEscapeKeyDown?.(event);
        return this.state.toggleOpening();
      }

      if (isSelectionKey(event)) {
        if (this.state.highlighted()) {
          this.state.toggleSelection(this.state.highlighted());
          this.root.valueChange.emit(this.state.selectedValues());
        }
        this.state.toggleOpening();
        event.preventDefault();

      } else if(!isNavigationKey(event)) {
        this.onSearchByKey(event);
      }
    } else if(!isNavigationKey(event) && !isSelectionKey(event)) {
      this.onSearchByKey(event);
    }
  }

  @HostListener('click') toggleSelect(): void {
    this.state.toggleOpening();
  }

  private onSearchByKey(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'Backspace') {
      this.searchTerm = this.searchTerm.slice(0, -1);
    } else {
      this.searchTerm += key;
    }

    const foundValue = this.state
      .items()
      .find(({ label }) => label.toLowerCase().includes(this.searchTerm.toLowerCase()))?.value;

    if (foundValue) {
      this.state.selectedValues.set([foundValue]);
    }

    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.searchTerm = '';
    }, 350);
  }
}
