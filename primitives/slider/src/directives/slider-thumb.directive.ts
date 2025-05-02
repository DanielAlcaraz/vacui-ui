import { Directive, ElementRef, HostListener, computed, inject } from '@angular/core';
import { SliderStateService } from '../state/slider.state.service';
import { SliderRootDirective } from './slider-root.directive';
import { hostBinding } from '@vacui-kit/primitives/utils';

@Directive({
  selector: '[vacSliderThumb]',
  standalone: true,
  host: {
    role: 'slider',
    tabIndex: '0',
    '[style.position]': '"absolute"'
  }
})
export class SliderThumbDirective {
  el = inject(ElementRef);
  state = inject(SliderStateService);
  private root = inject(SliderRootDirective);

  thumbIndex = computed<number>(() =>
    this.state.thumbs().findIndex(({ element }) => element === this.el.nativeElement),
  );

  constructor() {
    hostBinding('attr.data-orientation', this.state.orientation);
    hostBinding('attr.data-disabled', this.state.disabled);
    hostBinding('attr.aria-valuemin', this.state.min);
    hostBinding('attr.aria-valuemax', this.state.max);
    hostBinding('attr.aria-valuenow', computed(() => this.state.value()[this.thumbIndex()]));
    hostBinding('attr.aria-orientation', this.state.orientation);

    this.state.addThumb({ element: this.el.nativeElement });
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    this.root.onPointerDown(event);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const isHorizontal = this.state.orientation() === 'horizontal';
    const isShiftPressed = event.shiftKey;
    const stepFactor = isShiftPressed ? this.state.bigStepFactor() : 1;
    const inverted = this.state.inverted() ? -1 : 1;
  
    const keyActions: { [key: string]: () => void } = {
      ArrowLeft: () => this.moveByStep(isHorizontal ? -stepFactor * inverted : 0),
      ArrowRight: () => this.moveByStep(isHorizontal ? stepFactor * inverted : 0),
      ArrowUp: () => this.moveByStep(isHorizontal ? stepFactor : stepFactor * inverted),
      ArrowDown: () => this.moveByStep(isHorizontal ? -stepFactor : -stepFactor * inverted),
      PageUp: () => this.moveByStep(this.state.bigStepFactor() * inverted),
      PageDown: () => this.moveByStep(-this.state.bigStepFactor() * inverted),
      Home: () => this.root.updateThumbPosition(this.state.min(), this.thumbIndex()),
      End: () => this.root.updateThumbPosition(this.state.max(), this.thumbIndex()),
    };
  
    const action = keyActions[event.key];
    if (action) {
      action();
      event.preventDefault();
    }
  }

  private moveByStep(stepIncrement: number) {
    this.root.moveThumbByStep(this.thumbIndex(), stepIncrement);
  }
}
