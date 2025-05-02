import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {
  @Output() longPress = new EventEmitter<MouseEvent>();

  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly delay = 500;

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.timeoutId = setTimeout(() => {
      this.longPress.emit(event);
    }, this.delay);
  }

  @HostListener('mouseup')
  onMouseUp() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
