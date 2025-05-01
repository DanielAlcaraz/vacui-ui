import { Directive, OnDestroy, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { SelectStateService } from '../state/select-state.service';
import { SelectItemDirective } from './select-item.directive';

@Directive({
  selector: '[vacSelectItemIndicator]',
  exportAs: 'vacSelectItemIndicator',
  standalone: true,
})
export class SelectItemIndicatorDirective implements OnDestroy {
  state = inject(SelectStateService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  private item = inject(SelectItemDirective);

  constructor() {
    effect(() => {
      if (this.item.isSelected()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }
}
