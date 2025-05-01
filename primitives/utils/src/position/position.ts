import { Renderer2 } from '@angular/core';

export type PositioningOptions = {
  position: 'top' | 'right' | 'bottom' | 'left';
  avoidCollisions: boolean;
  collisionPadding: number | { top?: number; left?: number; bottom?: number; right?: number };
  align: 'start' | 'center' | 'end';
  alignOffset: number;
  sticky: 'partial' | 'always';
  sideOffset: number;
};

const defaultOptions: PositioningOptions = {
  position: 'top',
  avoidCollisions: true,
  collisionPadding: 0,
  align: 'center',
  alignOffset: 0,
  sticky: 'partial',
  sideOffset: 0,
};

class PositioningManager {
  private memoizedPaddings = new Map<number | string, { topPadding: number; leftPadding: number; bottomPadding: number; rightPadding: number }>();

  private readonly alignmentParams = {
    start: { horizontalAlignment: 0, verticalAlignment: 0 },
    center: { horizontalAlignment: 0.5, verticalAlignment: 0.5 },
    end: { horizontalAlignment: 1, verticalAlignment: 1 },
  };

  private readonly oppositePositions: Record<'top' | 'right' | 'bottom' | 'left', 'top' | 'right' | 'bottom' | 'left'> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };

  private getCollisionPaddingValues(collisionPadding: PositioningOptions['collisionPadding']) {
    const key = typeof collisionPadding === 'number' ? collisionPadding : JSON.stringify(collisionPadding);
    if (this.memoizedPaddings.has(key)) {
      return this.memoizedPaddings.get(key)!;
    }

    const result = typeof collisionPadding === 'number'
      ? { topPadding: collisionPadding, leftPadding: collisionPadding, bottomPadding: collisionPadding, rightPadding: collisionPadding }
      : { topPadding: 0, leftPadding: 0, bottomPadding: 0, rightPadding: 0, ...collisionPadding };

    this.memoizedPaddings.set(key, result);
    return result;
  }

  private calculatePositionsAroundTrigger(
    triggerRect: DOMRect,
    elementRect: { width: number; height: number },
    options: PositioningOptions,
  ): Record<'top' | 'right' | 'bottom' | 'left', { top: number; left: number }> {
    const { align, alignOffset, sideOffset } = options;
    const { horizontalAlignment, verticalAlignment } = this.alignmentParams[align];
    const alignOffsetValue = align === 'center' ? 0 : (align === 'start' ? -alignOffset : alignOffset);

    return {
      top: {
        top: -elementRect.height - sideOffset,
        left: (triggerRect.width - elementRect.width) * horizontalAlignment + alignOffsetValue,
      },
      right: {
        top: (triggerRect.height - elementRect.height) * verticalAlignment + alignOffsetValue,
        left: triggerRect.width + sideOffset,
      },
      bottom: {
        top: triggerRect.height + sideOffset,
        left: (triggerRect.width - elementRect.width) * horizontalAlignment + alignOffsetValue,
      },
      left: {
        top: (triggerRect.height - elementRect.height) * verticalAlignment + alignOffsetValue,
        left: -elementRect.width - sideOffset,
      },
    };
  }

  private findOptimalPosition(
    triggerRect: DOMRect,
    elementRect: { width: number; height: number },
    position: 'top' | 'right' | 'bottom' | 'left',
    paddings: { topPadding: number; leftPadding: number; bottomPadding: number; rightPadding: number },
  ): 'top' | 'right' | 'bottom' | 'left' {
    const { scrollX, scrollY } = window;
    const { clientWidth, clientHeight } = document.documentElement;
    const viewportTop = scrollY + paddings.topPadding;
    const viewportBottom = scrollY + clientHeight - paddings.bottomPadding;
    const viewportLeft = scrollX + paddings.leftPadding;
    const viewportRight = scrollX + clientWidth - paddings.rightPadding;
  
    const spaceTop = triggerRect.top - viewportTop;
    const spaceBottom = viewportBottom - triggerRect.bottom;
    const spaceLeft = triggerRect.left - viewportLeft;
    const spaceRight = viewportRight - triggerRect.right;
  
    const fits = {
      top: spaceTop >= elementRect.height,
      bottom: spaceBottom >= elementRect.height,
      left: spaceLeft >= elementRect.width,
      right: spaceRight >= elementRect.width,
    };
  
    if (fits[position]) {
      return position;
    }
  
    const oppositePosition = this.oppositePositions[position];
    if (fits[oppositePosition]) {
      return oppositePosition;
    }
  
    const spaces = { top: spaceTop, bottom: spaceBottom, left: spaceLeft, right: spaceRight };
    
    return Object.entries(spaces).reduce<'top' | 'right' | 'bottom' | 'left'>(
      (acc, [key, value]) => 
        spaces[acc as keyof typeof spaces] > value ? acc : key as 'top' | 'right' | 'bottom' | 'left',
      'top'
    );
  }

  private applyCalculatedPosition(
    renderer: Renderer2,
    element: HTMLElement,
    triggerRect: DOMRect,
    position: { top: number; left: number },
    elementRect: { width: number; height: number },
    options: PositioningOptions,
    paddings: { topPadding: number; leftPadding: number; bottomPadding: number; rightPadding: number },
  ) {
    const { scrollX, scrollY } = window;
    const { clientWidth, clientHeight } = document.documentElement;
    const isPartialSticky = options.sticky === 'partial';

    let tooltipTop = triggerRect.top + scrollY + position.top;
    let tooltipLeft = triggerRect.left + scrollX + position.left;

    if (isPartialSticky) {
      const triggerVisible = !(
        triggerRect.bottom < 0 || triggerRect.top > clientHeight ||
        triggerRect.right < 0 || triggerRect.left > clientWidth
      );

      if (triggerVisible) {
        const viewportTop = scrollY + paddings.topPadding;
        const viewportLeft = scrollX + paddings.leftPadding;
        const viewportBottom = scrollY + clientHeight - paddings.bottomPadding;
        const viewportRight = scrollX + clientWidth - paddings.rightPadding;

        tooltipTop = Math.max(
          Math.min(tooltipTop, viewportBottom - elementRect.height),
          viewportTop
        );
        tooltipLeft = Math.max(
          Math.min(tooltipLeft, viewportRight - elementRect.width),
          viewportLeft
        );
      }
    }

    const offsetParent = element.offsetParent || document.body;
    const offsetParentRect = offsetParent.getBoundingClientRect();
    const offsetTop = tooltipTop - offsetParentRect.top - scrollY;
    const offsetLeft = tooltipLeft - offsetParentRect.left - scrollX;

    renderer.setStyle(element, 'position', 'absolute');
    renderer.setStyle(element, 'top', `${offsetTop}px`);
    renderer.setStyle(element, 'left', `${offsetLeft}px`);
    renderer.setStyle(element, 'visibility', 'visible');
  }

  positionElement(
    renderer: Renderer2,
    element: HTMLElement,
    triggerElement: HTMLElement,
    options: Partial<PositioningOptions>,
  ): string {
    const mergedOptions: PositioningOptions = { ...defaultOptions, ...options };
    const triggerRect = triggerElement.getBoundingClientRect();
    const elementRect = { width: element.offsetWidth, height: element.offsetHeight };
    
    const newPosition = mergedOptions.avoidCollisions
      ? this.findOptimalPosition(
          triggerRect,
          elementRect,
          mergedOptions.position,
          this.getCollisionPaddingValues(mergedOptions.collisionPadding),
        )
      : mergedOptions.position;

    const positions = this.calculatePositionsAroundTrigger(triggerRect, elementRect, {
      ...mergedOptions,
      position: newPosition,
    });

    const adjustedPosition = positions[newPosition];
    if (adjustedPosition) {
      this.applyCalculatedPosition(
        renderer,
        element,
        triggerRect,
        adjustedPosition,
        elementRect,
        { ...mergedOptions, position: newPosition },
        this.getCollisionPaddingValues(mergedOptions.collisionPadding),
      );
      return newPosition;
    }

    return mergedOptions.position;
  }

  autoUpdatePosition(
    element: HTMLElement,
    triggerElement: HTMLElement,
    callback: () => void
  ): () => void {
    let rafId: number | null = null;

    const updatePosition = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          callback();
          rafId = null;
        });
      }
    };

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(element);
    resizeObserver.observe(triggerElement);

    const mutationObserver = new MutationObserver(updatePosition);
    mutationObserver.observe(triggerElement, { attributes: true, childList: true, subtree: true });

    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }
}

// Export a function that creates and returns a new instance of PositioningManager
export function createPositioningManager(): {
  positionElement: (renderer: Renderer2, element: HTMLElement, triggerElement: HTMLElement, options: Partial<PositioningOptions>) => string;
  autoUpdatePosition: (element: HTMLElement, triggerElement: HTMLElement, callback: () => void) => () => void;
} {
  const manager = new PositioningManager();
  return {
    positionElement: manager.positionElement.bind(manager),
    autoUpdatePosition: manager.autoUpdatePosition.bind(manager),
  };
}
