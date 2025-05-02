import { Directive } from '@angular/core';

@Directive({
  selector: '[vacSelectViewport]',
  standalone: true,
  exportAs: 'vacSelectViewport',
  host: { role: 'presentation', '[style.overflowY]': '"auto"' }
})
export class SelectViewportDirective {}
