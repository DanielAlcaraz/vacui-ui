import { Injectable, Renderer2, computed, inject, signal } from '@angular/core';
import { TooltipListener } from '../model/tooltip.model';
import { generateRandomId } from '@vacui-kit/primitives/utils';

@Injectable()
export class TooltipService {
  id = generateRandomId();
  mouseHover = signal(false);
  open = signal(false);
  openDelay = signal(0);
  closeDelay = signal(0);
  contentHover = signal(true);
  openState = computed(() =>
    this.open() && this.openDelay() === 0
      ? 'open'
      : this.open() && this.openDelay() > 0
        ? 'partly-opened'
        : 'closed',
  );

  private isActivated = false;
  private listener!: TooltipListener;
  private renderer = inject(Renderer2);
  private registeredElements = new Set<HTMLElement>();
  private elementStates = new Map<HTMLElement, boolean>();
  private listeners = new Map<HTMLElement, { mouseEnter: () => void; mouseLeave: () => void }>();

  trackElement(element: HTMLElement) {
    const mouseEnterListener = this.renderer.listen(element, 'mouseenter', () => {
      this.elementStates.set(element, true);
      this.updateHoverState();
    });

    const mouseLeaveListener = this.renderer.listen(element, 'mouseleave', () => {
      this.elementStates.set(element, false);
      setTimeout(() => this.updateHoverState());
    });

    this.listeners.set(element, { mouseEnter: mouseEnterListener, mouseLeave: mouseLeaveListener });
    this.registeredElements.add(element);
  }

  untrackElement(element: HTMLElement) {
    if (this.registeredElements.has(element)) {
      const listeners = this.listeners.get(element);
      if (listeners) {
        listeners.mouseEnter();
        listeners.mouseLeave();
        this.listeners.delete(element);
        this.elementStates.delete(element);
      }
      this.registeredElements.delete(element);
      this.updateHoverState();
    }
  }

  private updateHoverState() {
    this.mouseHover.set([...this.elementStates.values()].some((state) => state));
  }

  registerListener(listener: TooltipListener) {
    this.listener = listener;
  }

  activateTooltip(triggerElement: HTMLElement) {
    this.isActivated = true;
    this.listener?.activate(triggerElement);
  }

  deactivateTooltip() {
    if (this.isActivated) {
      this.isActivated = false;
      this.listener.deactivate();
    }
  }
}
