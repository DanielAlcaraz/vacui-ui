import { Directive, ElementRef, OnInit, effect, inject } from '@angular/core';
import { hostBinding } from '@vacui-ui/primitives/utils';
import { SelectItemDirective } from './select-item.directive';

@Directive({
  selector: '[vacSelectItemText]',
  exportAs: 'vacSelectItemText',
  standalone: true
})
export class SelectItemTextDirective implements OnInit {
  private item = inject(SelectItemDirective);
  private element = inject(ElementRef).nativeElement;

  constructor() {
    hostBinding('id', this.item.labelledby);
  }

  ngOnInit(): void {
    this.item.label.set(this.element.textContent.trim());
  }
}
