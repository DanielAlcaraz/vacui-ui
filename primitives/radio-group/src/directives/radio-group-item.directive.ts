import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { RadioGroupService } from '../state/radio-group-state.service';
import { KeyNavigationItemDirective } from '@vacui-kit/primitives/key-navigation';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { RadioGroupRootDirective } from './radio-group-root.directive';

@Directive({
  selector: '[vacRadioGroupItem]',
  exportAs: 'vacRadioGroupItem',
  standalone: true,
  host: { role: 'radio' },
  hostDirectives: [
    {
      directive: KeyNavigationItemDirective,
      inputs: ['disabled', 'startFocus'],
    },
  ],
})
export class RadioGroupItemDirective implements OnInit {
  readonly state = inject(RadioGroupService);
  private readonly root = inject(RadioGroupRootDirective);
  private readonly renderer = inject(Renderer2);
  private readonly element = inject(ElementRef);
  private readonly navigableItem = inject(KeyNavigationItemDirective);

  readonly value = input.required<string>();
  readonly disabled = input(this.state.disabled());
  readonly isChecked = computed(() => this.state.value() === this.value());
  readonly isDisabled = computed(() => this.disabled() || this.state.disabled());

  constructor() {
    hostBinding(
      'attr.data-disabled',
      computed(() => (this.isDisabled() ? '' : null)),
    );

    hostBinding(
      'disabled',
      computed(() => this.isDisabled()),
    );

    effect(() => {
      this.renderer.setAttribute(
        this.element.nativeElement,
        'data-state',
        this.isChecked() ? 'checked' : 'unchecked',
      );
      this.renderer.setAttribute(
        this.element.nativeElement,
        'aria-checked',
        this.isChecked() ? 'true' : 'false',
      );

      // If it is checked in the beginning, set start focus in the selected value.
      untracked(() => this.navigableItem.startFocus.set(this.isChecked()));
    });
  }

  ngOnInit(): void {
    this.state.registerItem(this.value(), this.disabled(), this.element);
  }

  @HostListener('focus', ['$event']) onFocus(event: Event) {
    this.selectRatio(event);
  }

  @HostListener('click', ['$event']) onClick(event: Event) {
    this.selectRatio(event);
  }

  @HostListener('keydown.space', ['$event']) onEnter(event: Event) {
    this.selectRatio(event);
  }

  private selectRatio(event: Event) {
    if (!this.isDisabled()) {
      this.state.value.set(this.value());
      this.root.valueChange.emit(this.value());
      event.preventDefault();
    }
  }
}
