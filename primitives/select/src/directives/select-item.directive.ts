import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { KeyNavigationItemDirective } from '@vacui-ui/primitives/key-navigation';
import { SelectStateService } from '../state/select-state.service';
import { SelectValue } from '../model/select.model';
import { SelectRootDirective } from './select-root.directive';
import { generateRandomId, hostBinding } from '@vacui-ui/primitives/utils';

@Directive({
  selector: '[vacSelectItem]',
  standalone: true,
  exportAs: 'vacSelectItem',
  hostDirectives: [
    {
      directive: KeyNavigationItemDirective,
      inputs: ['disabled', 'startFocus'],
    },
  ],
  host: {
    role: 'option',
  },
})
export class SelectItemDirective<T> implements OnDestroy {
  value = input.required<SelectValue<T>>();
  disabled = input(false);

  state = inject(SelectStateService);
  private element = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
  private root = inject(SelectRootDirective);

  // THINK: Hacer el label un input y el text lo lee para setear el texto.
  // Select-item-text will set the label when it reads the textContent.
  label = signal('');
  // Select-item-text uses it to set an ID
  labelledby = hostBinding('attr.aria-labelledby', signal(`vacui-${generateRandomId()}`));
  // expose to select-indicator
  isSelected = computed(() => this.state.isSelected(this.value()));
  private isDisabled = computed(() => this.state.disabled() || this.disabled());

  constructor() {
    hostBinding(
      'attr.aria-selected',
      computed(() => this.isSelected()),
    );

    hostBinding('id', this.value);

    hostBinding(
      'attr.data-state',
      computed(() => (this.isSelected() ? 'checked' : 'unchecked')),
    );

    hostBinding(
      'attr.data-disabled',
      computed(() => (this.isDisabled() ? '' : null)),
    );

    hostBinding(
      'attr.data-highlighted',
      computed(() => (this.state.highlighted() === this.value() ? '' : null)),
    );

    effect(() => {
      if (this.label() && this.value()) {
        untracked(() =>
          this.state.addInstance({
            value: this.value(),
            label: this.label(),
            disabled: this.isDisabled(),
            element: this.element,
          }),
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.state.removeInstance(this.value());
  }

  @HostListener('mouseover') onMouseover() {
    this.root.highlight(this.value());
  }

  @HostListener('click')
  select(): void {
    if (this.isDisabled()) return;
    this.state.toggleSelection(this.value());
    if (!this.state.multiple()) {
      this.state.toggleOpening();
    }
    this.root.valueChange.emit(this.state.selectedValues());
  }
}
