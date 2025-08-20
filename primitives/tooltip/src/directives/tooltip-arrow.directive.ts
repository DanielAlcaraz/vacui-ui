import {
  ComponentRef,
  Directive,
  ElementRef,
  Renderer2,
  ViewContainerRef,
  inject,
  input
} from '@angular/core';
import { ArrowComponent } from '../arrow/arrow.component';
import { TooltipPosition } from '../model/tooltip.model';
import { TooltipContentDirective } from './tooltip-content.directive';

@Directive({
  selector: '[vacTooltipArrow]',
  exportAs: 'vacTooltipArrow',
  standalone: true,
})
export class TooltipArrowDirective {
  arrow!: ComponentRef<ArrowComponent>;

  readonly arrowSize = input<{
    width: number;
    height: number;
} | number>(8);

  private renderer = inject(Renderer2);
  private viewContainerRef = inject(ViewContainerRef);
  private element = inject(ElementRef).nativeElement;
  private tooltipContent = inject(TooltipContentDirective);

  constructor() {
    this.tooltipContent.arrow = this;
  }

  createArrow(position: TooltipPosition, triggerElement: HTMLElement, contentElement: HTMLElement) {
    this.arrow = this.viewContainerRef.createComponent(ArrowComponent);
    const arrowElement = this.arrow.location.nativeElement;
    this.renderer.setStyle(this.element, 'position', 'absolute');

    this.renderer.appendChild(this.element, arrowElement);

    const { width, height } = this.getSize();
    this.arrow.setInput('width', width);
    this.arrow.setInput('height', height);

    this.updateArrow(position, triggerElement, contentElement);
  }

  updateArrow(position: TooltipPosition, triggerElement: HTMLElement, contentElement: HTMLElement) {
    const { width: arrowWidth, height: arrowHeight } = this.getSize();
    const contentRect = contentElement.getBoundingClientRect();
    const triggerRect = triggerElement.getBoundingClientRect();

    // Set arrow rotation based on position
    const rotation = this.getArrowRotation(position);
    this.renderer.setStyle(this.element, 'transform', `rotate(${rotation}deg)`);

    // Position the arrow
    this.positionArrow(position, triggerRect, contentRect, arrowWidth, arrowHeight);
  }

  private getArrowRotation(position: TooltipPosition): number {
    switch (position) {
      case 'top':
        return 0;
      case 'right':
        return 90;
      case 'bottom':
        return 180;
      case 'left':
        return -90;
    }
  }

  private positionArrow(
    position: TooltipPosition,
    triggerRect: DOMRect,
    contentRect: DOMRect,
    arrowWidth: number,
    arrowHeight: number,
  ) {
    let top: number, left: number;

    switch (position) {
      case 'top':
        top = contentRect.height;
        left = this.calculateCenterOffset(triggerRect, contentRect, 'horizontal', arrowWidth);
        break;
      case 'bottom':
        top = -arrowHeight;
        left = this.calculateCenterOffset(triggerRect, contentRect, 'horizontal', arrowWidth);
        break;
      case 'left':
        top = this.calculateCenterOffset(triggerRect, contentRect, 'vertical', arrowHeight);
        left = contentRect.width;
        break;
      case 'right':
        top = this.calculateCenterOffset(triggerRect, contentRect, 'vertical', arrowHeight);
        left = -arrowWidth;
        break;
    }

    this.renderer.setStyle(this.element, 'top', `${top}px`);
    this.renderer.setStyle(this.element, 'left', `${left}px`);
  }

  private calculateCenterOffset(
    triggerRect: DOMRect,
    contentRect: DOMRect,
    direction: 'horizontal' | 'vertical',
    arrowSize: number,
  ): number {
    if (direction === 'horizontal') {
      const centerX = triggerRect.left + triggerRect.width / 2 - contentRect.left;
      return Math.min(Math.max(centerX - arrowSize / 2, 0), contentRect.width - arrowSize);
    } else {
      const centerY = triggerRect.top + triggerRect.height / 2 - contentRect.top;
      return Math.min(Math.max(centerY - arrowSize / 2, 0), contentRect.height - arrowSize);
    }
  }

  getSize() {
    const arrowSize = this.arrowSize();
    return typeof arrowSize === 'number'
      ? { width: arrowSize, height: arrowSize }
      : arrowSize;
  }
}
