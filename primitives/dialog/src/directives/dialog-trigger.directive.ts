import { Directive, ElementRef, HostListener, Renderer2, effect, inject } from '@angular/core';
import { hostBinding, isSelectionKey } from '@vacui-ui/primitives/utils';
import { DialogStateService } from '../state/dialog-state.service';

@Directive({
  selector: '[vacDialogTrigger]',
  exportAs: 'vacDialogTrigger',
  standalone: true,
})
export class DialogTriggerDirective {
  state = inject(DialogStateService);
  private element = inject(ElementRef).nativeElement as HTMLElement;
  private renderer = inject(Renderer2);
  private firstRender = true;

  constructor() {
    hostBinding('data-state', this.state.dataState);
    this.renderer.setAttribute(this.element, 'aria-haspopup', 'dialog');

    effect(() => {
      if (this.state.open()) {
        this.firstRender = false;
        this.renderer.setAttribute(this.element, 'aria-expanded', 'true');
        this.renderer.setAttribute(this.element, 'aria-controls', this.state.contentId);
      } else {
        this.renderer.setAttribute(this.element, 'aria-expanded', 'false');
        this.renderer.removeAttribute(this.element, 'aria-controls');
        if (!this.firstRender) {
          this.element.focus();
        }
      }
    });
  }

  @HostListener('click')
  onClick() {
    this.state.open.update((open) => !open);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (isSelectionKey(event, { Tab: false })) {
      event.preventDefault();
      this.state.open.update((open) => !open);
    }
  }
}
