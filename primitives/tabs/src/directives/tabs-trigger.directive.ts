import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
} from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { ActivationState } from '../models/tabs.model';
import { TabsStateService } from '../state/tabs-state.service';

@Directive({
  selector: '[vacTabsTrigger]',
  exportAs: 'vacTabsTrigger',
  standalone: true,
  host: { role: 'tab' },
})
export class TabsTriggerDirective implements OnInit, OnDestroy {
  value = input.required<string>({ alias: 'vacTabsTrigger' });
  disabled = input(false);

  state = inject(TabsStateService);
  private elementRef = inject(ElementRef);

  constructor() {
    hostBinding(
      'attr.data-state',
      computed<ActivationState>(() => (this.value() === this.state.value() ? 'active' : 'inactive')),
    );
    hostBinding(
      'attr.data-disabled',
      computed(() => this.disabled() ?? null),
    );
    hostBinding(
      'attr.tabindex',
      computed(() => (this.value() === this.state.value() ? '0' : '-1')),
    );
    hostBinding(
      'attr.aria-selected',
      computed(() => this.value() === this.state.value()),
    );
    hostBinding(
      'attr.aria-controls',
      computed(() => `tabpanel-${this.value()}`),
    );
    hostBinding('attr.data-orientation', this.state.orientation);
  }

  ngOnInit(): void {
    this.state.registerTab(this.value(), this.elementRef, this.disabled());
  }

  ngOnDestroy(): void {
    this.state.unregisterTab(this.value());
  }

  @HostListener('click')
  onClick() {
    if(this.disabled()) return;
    this.state.value.set(this.value());
  }
}
