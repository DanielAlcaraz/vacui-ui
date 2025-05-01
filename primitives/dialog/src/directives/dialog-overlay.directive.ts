import {
  Directive,
  EmbeddedViewRef,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { DialogStateService } from '../state/dialog-state.service';

@Directive({
  selector: '[vacDialogOverlay]',
  exportAs: 'vacDialogOverlay',
  standalone: true,
})
export class DialogOverlayDirective implements OnDestroy {
  state = inject(DialogStateService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private renderer = inject(Renderer2);
  private view: EmbeddedViewRef<HTMLElement> | null = null;
  private readonly element = signal<HTMLElement | null>(null);

  private unsubscribeClickListener: (() => void) | null = null;
  private unsubscribePointerDownListener: (() => void) | null = null;
  private unsubscribeFocusOutListener: (() => void) | null = null;

  constructor() {
    effect(() => {
      const element = this.element();
      if (element) {
        this.renderer.setAttribute(element, 'data-state', this.state.dataState());
        this.renderer.setAttribute(element, 'aria-hidden', 'true');
        this.setListeners(element);
      } else {
        this.removeListeners();
      }
    });

    effect(() => {
      if (this.state.open()) {
        this.viewContainerRef.clear();
        this.view = this.viewContainerRef.createEmbeddedView(this.templateRef);
        const element = this.view.rootNodes[0] as HTMLElement;
        this.renderer.setStyle(element, 'pointerEvents', 'auto');
        untracked(() => this.element.set(element));
      } else {
        untracked(() => this.ngOnDestroy());
      }
    });
  }

  ngOnDestroy(): void {
    this.element.set(null);
    this.removeListeners();
    this.view?.destroy();
  }

  private setListeners(element: HTMLElement) {
    this.unsubscribeClickListener = this.renderer.listen(element, 'click', (event: MouseEvent) => {
      if (this.state.modal() && this.state.open()) {
        event.stopPropagation();
        this.state.open.set(false);
      }
    });

    this.unsubscribePointerDownListener = this.renderer.listen(
      element,
      'pointerdown',
      (event: PointerEvent) => {
        const ctrlLeftClick = event.button === 0 && event.ctrlKey;
        const isRightClick = event.button === 2 || ctrlLeftClick;

        if (isRightClick) {
          event.preventDefault();
        }
      },
    );

    this.unsubscribeFocusOutListener = this.renderer.listen(element, 'focusout', (event: FocusEvent) => {
      event.preventDefault();
    });
  }

  private removeListeners() {
    if (this.unsubscribeClickListener) {
      this.unsubscribeClickListener();
      this.unsubscribeClickListener = null;
    }
    if (this.unsubscribePointerDownListener) {
      this.unsubscribePointerDownListener();
      this.unsubscribePointerDownListener = null;
    }
    if (this.unsubscribeFocusOutListener) {
      this.unsubscribeFocusOutListener();
      this.unsubscribeFocusOutListener = null;
    }
  }
}
