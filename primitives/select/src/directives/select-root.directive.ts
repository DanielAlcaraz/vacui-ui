import { Directive, ElementRef, Injector, OnInit, Renderer2, computed, effect, inject, input, output, untracked } from '@angular/core';
import { KeyNavigationRootDirective, KeyboardNavigationService } from '@vacui-ui/primitives/key-navigation';
import { connectSignals, hostBinding } from '@vacui-ui/primitives/utils';
import { SelectCompareWith, SelectValue } from '../model/select.model';
import { SelectStateService } from '../state/select-state.service';

@Directive({
  selector: '[vacSelectRoot]',
  standalone: true,
  exportAs: 'vacSelectRoot',
  providers: [SelectStateService<string>],
  inputs: ['compareWith', 'disabled', 'required', 'multiple', 'onEscapeKeyDown'],
  hostDirectives: [
    {
      directive: KeyNavigationRootDirective,
      inputs: [
        'navigationRules',
        'direction',
        'loop',
        'disabled',
        'tabNavigation',
        'focusCallback',
        'rememberLastFocus',
      ],
    },
  ],
})
export class SelectRootDirective<T> implements OnInit {
  state = inject(SelectStateService);
  private keyboard = inject(KeyboardNavigationService);
  private injector = inject(Injector);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  value = input<SelectValue<T>>(null);
  valueChange = output<SelectValue<T>>();
  open = input(false);
  openChange = output<boolean>();
  name = input<string | null>(null);

  set disabled(disabled: boolean) {
    this.keyboard.disabled.set(disabled);
    this.state.disabled.set(disabled);
  }

  set required(required: boolean) {
    this.state.required.set(required);
  }

  set multiple(multiple: boolean) {
    this.state.multiple.set(multiple);
  }

  set onEscapeKeyDown(onEscapeKeyDown: (event: KeyboardEvent) => void) {
    this.state.onEscapeKeyDown = onEscapeKeyDown;
  }

  /**
   * In case we use a more complex type as value, we have to provide a function to override the comparation when we look for the selected value.
   */
  set compareWith(compareWith: SelectCompareWith<T>) {
    this.state.compareWith = compareWith;
  }

  highlightChange = output<SelectValue<T>>();

  private highlightCallback = (index: number) => {
    const { value } = this.state.items()[index];
    this.highlight(value);
  };

  private nativeSelectRef: HTMLSelectElement | null = null;

  constructor() {
    hostBinding('attr.data-state', this.state.dataState);
    hostBinding('attr.data-disabled', computed(() => this.state.disabled() ?? null));

    this.keyboard.tabNavigation = false;
    this.keyboard.lastFocusedIndex = -1;
    this.keyboard.rememberLastFocused = false;
    this.keyboard.mode.set('highlight');
    this.keyboard.highlightCallback = this.highlightCallback;
    // TODO: Añadir custom rules al keyService:
    // - PageUp 	Jumps visual focus up 10 options (or to first option).
    // - PageDown 	Jumps visual focus down 10 options (or to last option).
    // - Alt + Up Arrow
    // Sets the value to the content of the focused option in the listbox.
    // Closes the listbox.
    // Sets visual focus on the combobox.
    // TODO: New input, allow to block toggle. Force a value to always exist once it is selected

    connectSignals(this.open, this.state.open, this.openChange);

    this.valueChange.subscribe(value => {
      if (this.nativeSelectRef) {
        this.nativeSelectRef.value = value as string;
      }
    });
  }

  ngOnInit(): void {
    effect(
      () => {
        const value = this.value();
        untracked(() => this.state.addSelectedValue(value));
      },
      { injector: this.injector },
    );

    effect(
      () => {
        const value = this.state.selectedValues();
        const hasItems = this.state.items().length;
        const isOpen = this.state.open();

        untracked(() => {
          if (value.length && isOpen && hasItems) {
            this.highlight(Array.isArray(value) ? value[0] : value);
          } else if (!isOpen && !value.length && hasItems) {
            this.highlight();
          }
        });
      },
      { injector: this.injector },
    );

    effect(() => {
      const name = this.name();
      if (name && this.state.items().length) {
        if (this.nativeSelectRef) {
          this.renderer.removeChild(this.elementRef.nativeElement, this.nativeSelectRef);
        }
        this.nativeSelectRef = this.renderHiddenSelect(name);
      }
    },  { injector: this.injector });
  }

  highlight(value?: T) {
    if (value) {
      const index = this.state.items().findIndex((item) => item.value === value);
      this.state.highlighted.set(value);
      this.keyboard.lastFocusedIndex = index;
    } else {
      // We start with the first item highlighted
      this.state.highlighted.set(this.state.items()[0].value);
      this.keyboard.lastFocusedIndex = 0;
    }
  }

  private renderHiddenSelect(name: string) {
    const nativeSelect = this.renderer.createElement('select');
    this.renderer.setAttribute(nativeSelect, 'name', name);
    this.renderer.setAttribute(nativeSelect, 'aria-hidden', 'true');
    this.renderer.setStyle(nativeSelect, 'display', 'none');

    const selectedValue = this.state.selectedValues();

    this.renderer.appendChild(this.elementRef.nativeElement, nativeSelect);
    nativeSelect.value = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;

    return nativeSelect;
  }
}
