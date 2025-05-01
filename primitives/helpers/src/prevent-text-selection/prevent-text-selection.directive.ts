import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNoSelect]'
})
export class NoSelectDirective {
  constructor(el: ElementRef, renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'user-select', 'none');
    renderer.setStyle(el.nativeElement, '-webkit-user-select', 'none');
    renderer.setStyle(el.nativeElement, '-moz-user-select', 'none');
    renderer.setStyle(el.nativeElement, '-ms-user-select', 'none');
  }
}
