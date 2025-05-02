import {
  Directive,
  EmbeddedViewRef,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FocusTrap, ScrollLockService } from '@vacui-kit/primitives/utils';
import { DialogStateService } from '../state/dialog-state.service';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[vacDialogContent]',
  exportAs: 'vacDialogContent',
  standalone: true,
})
export class DialogContentDirective implements OnDestroy {
  state = inject(DialogStateService);
  private renderer = inject(Renderer2);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private scrollLockService = inject(ScrollLockService);
  private document = inject(DOCUMENT);

  closeAutoFocus = output<void>();
  pointerDownOutside = output<PointerEvent>();
  focusOutside = output<FocusEvent>();

  private view: EmbeddedViewRef<HTMLElement> | null = null;
  private readonly element = signal<HTMLElement | null>(null);
  private unsubscribeKeydownListener: () => void = () => null;
  private unsubscribePointerdownListener: () => void = () => null;
  private unsubscribeFocusinListener: () => void = () => null;
  private enableScroll: (() => void) | null = null;
  private focusTrap: FocusTrap | null = null;

  constructor() {
    effect(() => {
      const element = this.element();
      if (element) {
        this.renderer.setAttribute(
          element,
          'data-state',
          this.state.dataState()
        );
      }
    });

    effect(() => {
      if (this.state.open()) {
        this.setScrollHidden(true);
        this.view = this.viewContainerRef.createEmbeddedView(this.templateRef);
        const element = this.view.rootNodes[0];

        // Create focus trap with auto-focus option based on modal state
        this.focusTrap = FocusTrap.create(element, {
          document: this.document,
          autoFocus: this.state.modal(),
        });

        this.renderer.setAttribute(
          element,
          'data-state',
          this.state.dataState()
        );
        this.setAttributes(element);
        this.setListeners(element);

        untracked(() => this.element.set(element));
      } else {
        this.ngOnDestroy();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribeFocusinListener();
    this.unsubscribeKeydownListener();
    this.unsubscribePointerdownListener();
    this.setScrollHidden(false);
    this.focusTrap?.remove();
    this.view?.destroy();
    this.view = null;
  }

  private setAttributes(element: HTMLElement) {
    this.renderer.setAttribute(element, 'role', 'dialog');
    this.renderer.setAttribute(
      element,
      'aria-describedby',
      this.state.descriptionId
    );
    this.renderer.setAttribute(element, 'aria-labelledby', this.state.titleId);
    this.renderer.setAttribute(element, 'id', this.state.contentId);
    this.renderer.setAttribute(element, 'tabindex', '-1');
  }

  private setListeners(element: HTMLElement) {
    this.unsubscribeKeydownListener = this.renderer.listen(
      element,
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          this.state.open.set(false);
        }
      }
    );

    this.unsubscribePointerdownListener = this.renderer.listen(
      element,
      'pointerdown',
      (event: PointerEvent) => {
        if (this.state.open() && !element.contains(event.target as Node)) {
          this.pointerDownOutside.emit(event);
        }
      }
    );

    this.unsubscribeFocusinListener = this.renderer.listen(
      element,
      'focusin',
      (event: FocusEvent) => {
        if (this.state.open() && !element.contains(event.target as Node)) {
          event.preventDefault();
          this.focusOutside.emit(event);
          this.focusTrap?.focusFirst();
        }
      }
    );
  }

  private setScrollHidden(hidden: boolean) {
    if (hidden) {
      this.enableScroll = this.scrollLockService.disableScroll();
    } else if (this.enableScroll) {
      this.enableScroll();
      this.enableScroll = null;
    }
  }
}
