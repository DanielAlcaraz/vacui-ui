import { Directive, ElementRef, HostListener, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { KeyNavigationItemDirective } from '@vacui-ui/primitives/key-navigation';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { AccordionStateService } from '../state/accordion.service';
import { AccordionItemDirective } from './accordion-item.directive';
import { AccordionRootDirective } from './accordion-root.directive';

@Directive({
  selector: '[vacAccordionTrigger]',
  standalone: true,
  exportAs: 'vacAccordionTrigger',
  hostDirectives: [
    {
      directive: KeyNavigationItemDirective,
      inputs: ['disabled', 'startFocus'],
    },
  ],
})
export class AccordionTriggerDirective implements OnInit, OnDestroy {
  state = inject(AccordionStateService);
  private item = inject(AccordionItemDirective);
  private elementRef = inject(ElementRef);
  private root = inject(AccordionRootDirective);

  constructor() {
    hostBinding(
      'attr.id',
      computed(() => this.state.generateAriaControlId(this.item.id, this.item.value(), 'trigger')),
    );

    hostBinding(
      'attr.aria-expanded',
      computed(() => this.item.getItem().state === 'open'),
    );

    hostBinding(
      'attr.aria-controls',
      computed(() => this.state.generateAriaControlId(this.item.id, this.item.value(), 'panel')),
    );

    hostBinding(
      'attr.aria-disabled',
      computed(() => {
        const item = this.item.getItem();
        return item?.disabled && item.state === 'open' ? 'true' : null;
      }),
    );

    hostBinding('attr.data-orientation', this.state.orientation);

    hostBinding(
      'attr.data-disabled',
      computed(() => (this.item.disabled() || this.state.disabled() ? '' : null)),
    );

    hostBinding(
      'attr.data-state',
      computed(() => this.item.getItem()?.state),
    );
  }

  ngOnInit(): void {
    this.state.bindTrigger(this.item.value(), this.elementRef);
  }

  ngOnDestroy(): void {
    this.state.removeTrigger(this.item.value());
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onClick();
      event.preventDefault();
      return;
    }
  }

  @HostListener('click')
  onClick() {
    const item = this.item.getItem();
    const config = this.state.getConfig();
    if (item.disabled || config.disabled) return;

    this.state.toggleItem(item.id);
    this.root.toggle.emit(item.id);
  }
}
