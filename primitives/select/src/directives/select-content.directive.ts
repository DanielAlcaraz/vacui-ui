import {
  AfterRenderPhase,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { PositioningOptions, createPositioningManager, hostBinding } from '@vacui-ui/primitives/utils';
import { SelectStateService } from '../state/select-state.service';

@Directive({
  selector: '[vacSelectContent]',
  exportAs: 'vacSelectContent',
  standalone: true,
  host: {
    role: 'listbox',
    tabindex: '-1',
  },
})
export class SelectContentDirective implements OnDestroy {
  position = input<'top' | 'right' | 'bottom' | 'left'>('bottom');
  positionOffset = input(0);
  align = input<'start' | 'center' | 'end'>('center');
  alignOffset = input(0);
  avoidCollisions = input(true);
  collisionPadding = input<number | { top?: number; left?: number; bottom?: number; right?: number }>(10);
  onCloseAutoFocus: (() => void) | null = null;

  state = inject(SelectStateService);
  private cleanUpdateContentPosition: (() => void) | null = null;
  private renderer = inject(Renderer2);
  private element = inject(ElementRef).nativeElement;
  private positioningManager = createPositioningManager();

  dataSideAttribute = hostBinding(
    'attr.data-position',
    signal<'top' | 'right' | 'bottom' | 'left'>('bottom'),
  );
  dataAlignAttribute = hostBinding('attr.data-align', signal<'start' | 'end' | 'center'>('center'));

  constructor() {
    hostBinding('id', this.state.ariaControls);
    hostBinding(
      'attr.aria-activedescendant',
      computed(() => (!this.state.multiple() ? this.state.highlighted() : null)),
    );
    hostBinding('attr.data-state', this.state.dataState);
    hostBinding('attr.aria-multiselectable', this.state.multiple);

    afterNextRender(
      () => {
        if (this.state.open()) this.updatePosition();
      },
      { phase: AfterRenderPhase.MixedReadWrite },
    );

    effect(() => {
      if (this.state.open()) {
        this.updatePosition();
      } else {
        if (this.cleanUpdateContentPosition) this.cleanUpdateContentPosition();
        if (this.onCloseAutoFocus) this.onCloseAutoFocus();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cleanUpdateContentPosition) {
      this.cleanUpdateContentPosition();
    }
  }

  private updatePosition(): void {
    const positioningOptions: PositioningOptions = {
      position: this.position(),
      avoidCollisions: this.avoidCollisions(),
      collisionPadding: this.collisionPadding(),
      align: this.align(),
      alignOffset: this.alignOffset(),
      sticky: 'partial',
      sideOffset: this.positionOffset(),
    };

    this.calculatePosition(positioningOptions);

    this.cleanUpdateContentPosition = this.positioningManager.autoUpdatePosition(
      this.element,
      this.state.triggerElement,
      () => this.calculatePosition(positioningOptions),
    );
  }

  private calculatePosition(positioningOptions: PositioningOptions) {
    const newPosition = this.positioningManager.positionElement(
      this.renderer,
      this.element,
      this.state.triggerElement,
      positioningOptions,
    );
    untracked(() => {
      this.dataSideAttribute.set(newPosition as 'top' | 'right' | 'bottom' | 'left');
      this.dataAlignAttribute.set(positioningOptions.align);
    });
  }

  @HostListener('keydown.esc', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.state.onEscapeKeyDown) {
      this.state.onEscapeKeyDown(event);
    }
    this.state.toggleOpening();
  }
}
