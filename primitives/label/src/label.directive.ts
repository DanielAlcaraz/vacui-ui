import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'label[vacLabelRoot]',
  exportAs: 'vacLabelRoot',
  standalone: true
})
export class LabelRootDirective {
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (!event.defaultPrevented && event.detail > 1) {
      event.preventDefault();
    }
  }
}
