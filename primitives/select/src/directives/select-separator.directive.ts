import { Directive } from '@angular/core';
import { SeparatorRootDirective } from '@vacui-kit/primitives/separator';

@Directive({
  selector: '[vacSelectSeparator]',
  exportAs: 'vacSelectSeparator',
  standalone: true,
  hostDirectives: [{
    directive: SeparatorRootDirective,
    inputs: ['orientation', 'decorative']
  }]
})
export class SelectSeparatorDirective {}
