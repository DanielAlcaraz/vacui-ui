import {
  AfterContentInit,
  Directive,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  Renderer2,
  computed,
  inject,
  output,
} from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { SliderStateService } from '../state/slider.state.service';

@Directive({
  selector: '[vacSliderRoot]',
  standalone: true,
  providers: [SliderStateService],
  inputs: [
    'min',
    'max',
    'step',
    'orientation',
    'disabled',
    'bigStepFactor',
    'name',
    'minStepsBetweenThumbs',
    'value',
    'inverted'
  ],
})
export class SliderRootDirective implements AfterContentInit, OnDestroy {
  state = inject(SliderStateService);

  set min(min: number) {
    this.state.min.set(min);
  }
  set max(max: number) {
    this.state.max.set(max);
  }
  set step(step: number) {
    this.state.step.set(step);
  }
  set orientation(orientation: 'vertical' | 'horizontal') {
    this.state.orientation.set(orientation);
  }
  set disabled(disabled: boolean) {
    this.state.disabled.set(disabled);
  }
  set bigStepFactor(bigStepFactor: number) {
    this.state.bigStepFactor.set(bigStepFactor);
  }
  set name(name: string) {
    this.state.name.set(name);
  }
  set minStepsBetweenThumbs(minStepsBetweenThumbs: number) {
    this.state.minStepsBetweenThumbs.set(minStepsBetweenThumbs);
  }
  set value(value: number[]) {
    // An array to support multiple thumbss, we set 0 in case the user pass a false value
    this.state.value.set(value ?? [0]);
  }
  set inverted(inverted: boolean) {
    this.state.inverted.set(inverted);
  }

  valueChange = output<number[]>();
  valueCommit = output<number[]>();

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private ngZone = inject(NgZone);

  // State to keep track of the active thumb and value
  private isActive = false;
  private activeThumbIndex = 0;
  private docListeners: (() => void)[] = [];

  constructor() {
    hostBinding('attr.data-orientation', this.state.orientation);
    hostBinding('attr.data-disabled', this.state.disabled);
    hostBinding(
      'style.touchAction',
      computed(() => (this.state.disabled() ? 'none' : null)),
    );

    // Run outside Angular's zone to improve performance
    this.ngZone.runOutsideAngular(() => {
      this.docListeners.push(
        this.renderer.listen('document', 'pointerup', this.onDocumentPointerUp.bind(this)),
        this.renderer.listen('document', 'pointermove', this.onDocumentPointerMove.bind(this)),
      );
    });
  }

  ngAfterContentInit(): void {
    // Set initial value depending on how many thumbs we have
    if (!this.state.value().length) {
      const numberOfThumbs = this.state.thumbs().length;
      let spacing = 0;

      // Calculate the spacing between thumbs if there are more than one
      if (numberOfThumbs > 1) {
        spacing = (this.state.max() - this.state.min()) / (numberOfThumbs - 1);
      }

      // Set the initial value for each thumb
      for (let i = 0; i < numberOfThumbs; i++) {
        this.state.value.mutate((values) => {
          values[i] = this.state.min() + spacing * i;
          return values;
        });
      }
    }

    // Set initial thumb position for each thumb based on its value
    this.state.value().forEach((val, index) => {
      this.applyThumbPosition(val, index);
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the document listeners when the directive is destroyed
    this.docListeners.forEach((unsubscribe) => unsubscribe());
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    if (event.button !== 0 || this.state.disabled()) return;

    // Find the closest thumb to the pointer event
    const thumb = this.getClosestThumb(event);
    if (!thumb) return;

    this.activeThumbIndex = thumb.index;
    this.isActive = true;

    // Get the client X or Y position based on the slider orientation
    const clientXY = this.state.orientation() === 'horizontal' ? event.clientX : event.clientY;

    // Apply the new position to the active thumb
    this.applyPosition(clientXY, thumb.index);
  }

  moveThumbByStep(index: number, stepIncrement: number) {
    const value = this.state.value()[index] || 0;
    const newValue = value + stepIncrement * this.state.step();
    this.updateThumbPosition(newValue, index);
  }

  updateThumbPosition(val: number, index: number) {
    if (this.state.disabled()) return;
    const value = Math.min(Math.max(val, this.state.min()), this.state.max());

    // Apply the minStepsBetweenThumbs constraint if it is provided and there is more than one thumb
    const minStepsBetweenThumbs = this.state.minStepsBetweenThumbs();
    if (minStepsBetweenThumbs && this.state.value().length > 1) {
      for (let i = 0; i < this.state.value().length; i++) {
        if (i !== index) {
          const otherValue = this.state.value()[i];
          // If the distance between the thumbs is less than the restriction, do not update.
          if (Math.abs(value - otherValue) < minStepsBetweenThumbs * this.state.step()) {
            return;
          }
        }
      }
    }

    // Update the value if it has changed
    if (this.state.value()[index] !== value) {
      this.state.value.mutate((values) => {
        values[index] = value;
        return values;
      });
      this.applyThumbPosition(value, index);
      this.valueChange.emit(this.state.value());
    }
  }

  private onDocumentPointerUp() {
    this.ngZone.run(() => {
      this.isActive = false;
      this.valueCommit.emit(this.state.value());
    });
  }

  private onDocumentPointerMove(event: PointerEvent) {
    this.ngZone.run(() => {
      if (!this.isActive) return;

      // Get the client X or Y position based on the slider orientation
      const clientXY = this.state.orientation() === 'horizontal' ? event.clientX : event.clientY;
      // Apply the new position to the active thumb
      this.applyPosition(clientXY, this.activeThumbIndex);
    });
  }

  private applyPosition(clientXY: number, index: number) {
    const thumbEl = this.getAllThumbs()[index];
    const rect = this.state.trackElement.getBoundingClientRect();
    const thumbSize =
      this.state.orientation() === 'horizontal' ? thumbEl.offsetWidth / 2 : thumbEl.offsetHeight / 2;
    let percent: number;

    // Calculate the percentage of the thumb position based on the slider orientation
    if (this.state.orientation() === 'horizontal') {
      percent = this.state.inverted()
        ? 1 - (clientXY - rect.left - thumbSize) / (rect.width - thumbSize * 2)
        : (clientXY - rect.left - thumbSize) / (rect.width - thumbSize * 2);
    } else {
      percent = this.state.inverted()
        ? (clientXY - rect.top - thumbSize) / (rect.height - thumbSize * 2)
        : 1 - (clientXY - rect.top - thumbSize) / (rect.height - thumbSize * 2);
    }

    // Clamp the percentage between 0 and 1
    percent = Math.max(0, Math.min(1, percent));
    // Calculate the new value based on the percentage and the min/max values
    const val = percent * (this.state.max() - this.state.min()) + this.state.min();
    // Round the value to the nearest step
    const newStepValue = Math.round(val / this.state.step()) * this.state.step();
    // Update the thumb position with the new value
    this.updateThumbPosition(newStepValue, index);
  }

  private applyThumbPosition(value: number, index: number) {
    const thumbs = this.getAllThumbs();
    if (!thumbs || index >= thumbs.length) return;

    const thumb = thumbs[index];
    // Calculate the position percentage based on the value and the min/max values
    const positionPercent = this.state.inverted()
      ? ((this.state.max() - value) / (this.state.max() - this.state.min())) * 100
      : ((value - this.state.min()) / (this.state.max() - this.state.min())) * 100;
    // Calculate the thumb size percentage based on the thumb size and the track size
    const thumbSizePercent =
      ((this.state.orientation() === 'horizontal' ? thumb.offsetWidth : thumb.offsetHeight) /
        2 /
        (this.state.orientation() === 'horizontal'
          ? this.el.nativeElement.offsetWidth
          : this.el.nativeElement.offsetHeight)) *
      100;

    // Update the thumb position based on the slider orientation
    if (this.state.orientation() === 'horizontal') {
      this.renderer.setStyle(thumb, 'left', `calc(${positionPercent}% - ${thumbSizePercent}%)`);
    } else {
      this.renderer.setStyle(thumb, 'bottom', `calc(${positionPercent}% - ${thumbSizePercent}%)`);
    }
  }

  private getClosestThumb(e: PointerEvent): { thumb: HTMLElement; index: number } | null {
    const thumbs = this.getAllThumbs();
    if (!thumbs?.length) return null;

    // Calculate the Euclidean distance between the pointer event and each thumb
    const distances = thumbs.map((thumb) => {
      const rect = thumb.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.right) / 2;
      const dy = e.clientY - (rect.top + rect.bottom) / 2;
      return Math.sqrt(dx * dx + dy * dy);
    });

    // Find the thumb with the minimum distance to the pointer event
    const thumb = thumbs[distances.indexOf(Math.min(...distances))];
    const index = thumbs.indexOf(thumb);

    return { thumb, index };
  }

  private getAllThumbs(): HTMLElement[] {
    // Get all the thumb elements from the state service
    return this.state.thumbs().map((thumb) => thumb.element);
  }
}
