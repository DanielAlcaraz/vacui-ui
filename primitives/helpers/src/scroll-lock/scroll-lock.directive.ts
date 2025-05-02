import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appScrollLock]'
})
export class ScrollLockDirective {
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
  }
}
