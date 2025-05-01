import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  computed,
  inject,
  input,
  output,
  signal,
  effect,
  OnInit,
  untracked,
} from '@angular/core';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { ToggleGroupStateService } from '../state/toggle-group-state.service';
import { ToggleGroupRootDirective } from './toggle-group-root.directive';

@Directive({
  selector: '[vacToggleGroupItem]',
  standalone: true,
  exportAs: 'vacToggleGroupItem',
})
export class ToggleGroupItemDirective implements OnInit {
  state = inject(ToggleGroupStateService);
  private element = inject(ElementRef).nativeElement;
  private renderer = inject(Renderer2);
  private root = inject(ToggleGroupRootDirective);

  value = input.required<string>();
  disabled = input(false);
  toggle = output();
  pressed = signal(false);

  private isDisabled = computed(() => this.disabled() || this.root.disabled());
  private isSelected = computed(() =>
    this.root.type() === 'single'
      ? this.value() === this.root.value()
      : this.root.value()?.includes(this.value()) ?? false,
  );
  private focused = false;

  constructor() {
    hostBinding(
      'attr.role',
      computed(() => (this.root.type() === 'single' ? 'radio' : null)),
    );
    hostBinding(
      'attr.aria-pressed',
      computed(() => (this.root.type() === 'multiple' ? this.pressed() : null)),
    );
    hostBinding(
      'attr.aria-checked',
      computed(() => (this.root.type() === 'single' ? this.pressed() : null)),
    );
    hostBinding('attr.data-orientation', this.root.orientation);
    hostBinding(
      'attr.data-state',
      computed(() => (this.pressed() ? 'on' : 'off')),
    );
    hostBinding('attr.data-disabled', this.isDisabled);
    hostBinding(
      'attr.tabindex',
      computed(() => this.calculateTabIndex()),
    );

    this.state.items.mutate((items) => [...items, this]);
    effect(() => {
      if (this.root.type() === 'single') {
        untracked(() => this.pressed.set(this.isSelected()));
      } else {
        const arrValue = Array.isArray(this.root.value()) ? (this.root.value() as string[]) : [];
        untracked(() => this.pressed.set(arrValue.includes(this.value())));
      }
      this.updateTabIndex();
    });
  }

  ngOnInit() {
    if (this.root.type() === 'single') {
      this.pressed.set(this.isSelected());
    } else {
      const arrValue = Array.isArray(this.root.value()) ? (this.root.value() as string[]) : [];
      this.pressed.set(arrValue.includes(this.value()));
    }
    this.updateTabIndex();
  }

  @HostListener('click') onClick() {
    if (!this.isDisabled()) {
      this.pressed.update((pressed) => !pressed);
      this.toggle.emit();
      this.updateTabIndex();
    }
  }

  @HostListener('blur') onBlur() {
    this.focused = false;
    this.updateTabIndex();
  }

  @HostListener('focus') onFocus() {
    if (!this.isDisabled()) {
      this.focused = true;
      this.updateTabIndex();
    }
  }

  focus() {
    if (!this.isDisabled()) {
      this.focused = true;
      this.element.focus();
    }
  }

  isFocused(): boolean {
    return this.focused;
  }

  private updateTabIndex() {
    const items = this.state.items();
    const focusedItem = items.find((item) => item.isFocused());
    const pressedItems = items.filter((item) => item.pressed());

    if (this.isDisabled()) {
      this.renderer.setAttribute(this.element, 'tabindex', '-1');
      return;
    }

    if (focusedItem) {
      items.forEach((item) => {
        item.renderer.setAttribute(
          item.element,
          'tabindex',
          item === focusedItem && item.pressed() ? '0' : '-1',
        );
      });
    } else {
      const firstItem = pressedItems.length > 0 ? pressedItems[0] : items.find((item) => !item.isDisabled());
      if (firstItem) {
        firstItem.renderer.setAttribute(firstItem.element, 'tabindex', '0');
        pressedItems.slice(1).forEach((item) => item.renderer.setAttribute(item.element, 'tabindex', '-1'));
      }
    }
  }

  private calculateTabIndex() {
    const items = this.state.items();
    const anyPressed = items.some((item) => item.pressed());

    if ((this.pressed() && this.focused) || (!anyPressed && items.indexOf(this) === 0)) return 0;
    return -1;
  }
}
