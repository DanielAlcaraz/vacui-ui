import { Directive, ElementRef, Renderer2, effect, inject } from '@angular/core';
import { ProgressStateService } from '../state/progress-state.service';

@Directive({
  selector: '[vacProgressIndicator]',
  standalone: true,
  exportAs: 'vacProgressIndicator'
})
export class ProgressIndicatorDirective {
  state = inject(ProgressStateService);
  private renderer = inject(Renderer2);
  private element = inject(ElementRef).nativeElement;

  constructor() {
    effect(() => {
      const { value, max } = this.state;
      this.renderer.setAttribute(this.element, 'data-state', this.state.getProgressState());
      this.renderer.setAttribute(this.element, 'data-value', (value() ?? 0).toString());
      this.renderer.setAttribute(this.element, 'data-max', max().toString());
    });
  }
}
