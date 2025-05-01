import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';
import { ProgressStateService } from '../state/progress-state.service';
import { connectSignals } from '@vacui-ui/primitives/utils';

@Directive({
  selector: '[vacProgressRoot]',
  standalone: true,
  exportAs: 'vacProgressRoot',
  providers: [ProgressStateService],
  inputs: ['getValueLabel'],
  host: { role: 'progressbar', 'aria-valuemin': '0' },
})
export class ProgressRootDirective {
  state = inject(ProgressStateService);
  private renderer = inject(Renderer2);
  private element = inject(ElementRef).nativeElement;

  value = input<number | null>(this.state.value());
  max = input(this.state.max());
  getValueLabel?: (value: number, max: number) => string;

  constructor() {
    connectSignals(this.value, this.state.value);
    connectSignals(this.max, this.state.max);

    effect(() => {
      const max = this.state.max();
      this.renderer.setAttribute(this.element, 'aria-valuemax', max.toString());
      this.renderer.setAttribute(this.element, 'data-max', max.toString());
    });

    effect(() => {
      const value = this.state.value();
      const max = this.state.max();
      this.renderer.setAttribute(this.element, 'aria-valuetext', this.getAriaValueText(value ?? 0, max));
      this.renderer.setAttribute(this.element, 'aria-valuenow', (value ?? 0).toString());
      this.renderer.setAttribute(this.element, 'data-state', this.state.getProgressState());
      this.renderer.setAttribute(this.element, 'data-value', (value ?? 0).toString());
    });
  }

  private getAriaValueText(value: number, max: number): string {
    return this.getValueLabel ? this.getValueLabel(value, max) : this.defaultGetValueLabel(value, max);
  }

  private defaultGetValueLabel(value: number, max: number) {
    return `${Math.round((value / max) * 100)}%`;
  }
}
