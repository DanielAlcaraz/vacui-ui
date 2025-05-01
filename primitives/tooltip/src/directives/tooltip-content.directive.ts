import { DOCUMENT } from '@angular/common';
import {
  Directive,
  EmbeddedViewRef,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TooltipService } from '../controller/tooltip.service';
import { TooltipPosition } from '../model/tooltip.model';
import { TooltipArrowDirective } from './tooltip-arrow.directive';
import { createPositioningManager, PositioningOptions } from '@vacui-ui/primitives/utils';

@Directive({
  selector: '[vacTooltipContent]',
  exportAs: 'vacTooltipContent',
  standalone: true,
})
export class TooltipContentDirective implements OnInit, OnDestroy {
  state = inject(TooltipService);
  arrow: TooltipArrowDirective | null = null;
  tooltipRendered = output<{
    position: TooltipPosition;
    triggerElement: HTMLElement;
    contentElement: HTMLElement;
  }>();

  /* INPUTS */
  position = input<TooltipPosition>('top', { alias: 'vacTooltipContent' });
  avoidCollisions = input(true, { alias: 'vacTooltipContentAvoidCollisions' });
  collisionPadding = input<number | { top?: number; left?: number; bottom?: number; right?: number }>(0, {
    alias: 'vacTooltipContentCollisionPadding',
  });
  align = input<'start' | 'center' | 'end'>('center', { alias: 'vacTooltipAlign' });
  alignOffset = input(0, { alias: 'vacTooltipContentAlignOffset' });
  sticky = input<'partial' | 'always'>('partial', { alias: 'vacTooltipSticky' });
  sideOffset = input(0, { alias: 'vacTooltipSideOffset' });

  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private element = signal<HTMLElement | null>(null);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private view: EmbeddedViewRef<HTMLElement> | null = null;
  private bridgeElement: HTMLElement | null = null;
  private stopAutoUpdate: (() => void) | null = null;
  private openTimeout: ReturnType<typeof setTimeout> | null = null;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private positioningManager = createPositioningManager();

  constructor() {
    effect(() => {
      const element = this.element();
      if (element) {
        this.renderer.setAttribute(element, 'data-state', this.state.openState());
        this.renderer.setAttribute(element, 'data-position', this.position());
        this.renderer.setAttribute(element, 'data-align', this.align());
      }
    });
  }

  ngOnInit() {
    this.state.registerListener({
      activate: (triggerElement) => this.handleOpen(triggerElement),
      deactivate: () => this.handleClose(),
    });
  }

  ngOnDestroy() {
    this.state.deactivateTooltip();
  }

  private handleOpen(triggerElement: HTMLElement) {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }

    const openDelay = this.state.openDelay();
    if (openDelay > 0) {
      this.openTimeout = setTimeout(() => this.activateTooltip(triggerElement), openDelay);
    } else {
      this.activateTooltip(triggerElement);
    }
  }

  private handleClose() {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }

    const closeDelay = this.state.closeDelay();
    if (closeDelay > 0) {
      this.closeTimeout = setTimeout(() => this.deactivateTooltip(), closeDelay);
    } else {
      this.deactivateTooltip();
    }
  }

  private activateTooltip(triggerElement: HTMLElement) {
    this.view = this.viewContainerRef.createEmbeddedView(this.templateRef);
    const element = this.view.rootNodes[0] as HTMLElement;
    this.element.set(element);
    this.setTooltipAttributes(element);
    requestAnimationFrame(() => {
      this.positionTooltip(triggerElement, element);
    });

    this.stopAutoUpdate = this.positioningManager.autoUpdatePosition(element, triggerElement, () => {
      this.positionTooltip(triggerElement, element);
    });
  }

  private deactivateTooltip() {
    if (this.view) {
      if (this.bridgeElement) {
        this.state.untrackElement(this.bridgeElement);
        this.renderer.removeChild(this.document.body, this.bridgeElement);
        this.bridgeElement = null;
      }

      if (this.stopAutoUpdate) {
        this.stopAutoUpdate();
        this.stopAutoUpdate = null;
      }

      this.state.untrackElement(this.element()!);
      this.element.set(null);
      this.view.destroy();
    }
  }

  private setTooltipAttributes(element: HTMLElement) {
    this.renderer.setAttribute(element, 'role', 'tooltip');
    this.renderer.setAttribute(element, 'tabindex', '-1');
    this.renderer.setAttribute(element, 'id', this.state.id);
    this.renderer.setStyle(element, 'display', 'block');
    this.renderer.setStyle(element, 'position', 'absolute');
  }

  private positionTooltip(triggerElement: HTMLElement, element: HTMLElement) {
    const arrowSize = this.arrow ? this.arrow.getSize() : { width: 0, height: 0 };
    const options: PositioningOptions = {
      position: this.position(),
      avoidCollisions: this.avoidCollisions(),
      collisionPadding: this.collisionPadding(),
      align: this.align(),
      alignOffset: this.alignOffset(),
      sticky: this.sticky(),
      sideOffset:
        this.sideOffset() +
        (this.position() === 'top' || this.position() === 'bottom' ? arrowSize.height : arrowSize.width),
    };

    const newPosition = this.positioningManager.positionElement(this.renderer, element, triggerElement, options) as TooltipPosition;
    this.createBridge(triggerElement, newPosition);
    this.state.trackElement(element);

    if (this.arrow && !this.arrow.arrow) {
      this.arrow.createArrow(newPosition, triggerElement, element);
    } else if (this.arrow && this.arrow.arrow) {
      this.arrow.updateArrow(newPosition, triggerElement, element);
    }
  }

  private createBridge(triggerElement: HTMLElement, position: TooltipPosition) {
    const arrowSize = this.arrow ? this.arrow.getSize() : { height: 0, width: 0 };
    const triggerRect = triggerElement.getBoundingClientRect();

    if (!this.bridgeElement) {
      this.bridgeElement = this.renderer.createElement('div');
      this.renderer.setStyle(this.bridgeElement, 'position', 'absolute');
      this.renderer.setStyle(this.bridgeElement, 'background-color', 'transparent');
      this.renderer.setStyle(this.bridgeElement, 'z-index', '1');
      this.state.trackElement(this.bridgeElement!);
      this.renderer.appendChild(this.document.body, this.bridgeElement);
    }

    const bridgeSize = {
      width: position === 'left' || position === 'right' 
        ? arrowSize.width + this.sideOffset() + 10 
        : triggerRect.width,
      height: position === 'top' || position === 'bottom' 
        ? arrowSize.height + this.sideOffset() + 10 
        : triggerRect.height
    };

    this.renderer.setStyle(this.bridgeElement, 'width', `${bridgeSize.width}px`);
    this.renderer.setStyle(this.bridgeElement, 'height', `${bridgeSize.height}px`);

    const bridgePositionOptions: PositioningOptions = {
      position,
      avoidCollisions: false,
      collisionPadding: 0,
      align: 'center',
      alignOffset: 0,
      sticky: 'always',
      sideOffset: -5 // Slight overlap with the trigger element
    };

    this.positioningManager.positionElement(
      this.renderer,
      this.bridgeElement!,
      triggerElement,
      bridgePositionOptions
    );
  }
}
