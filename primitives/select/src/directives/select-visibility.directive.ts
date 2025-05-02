import {
  AfterViewInit,
  Directive,
  EmbeddedViewRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
} from '@angular/core';
import { SelectStateService } from '../state/select-state.service';

@Directive({
  selector: '[vacSelectVisibility]',
  exportAs: 'vacSelectVisibility',
  standalone: true,
})
export class SelectVisibilityDirective implements AfterViewInit, OnDestroy {
  state = inject(SelectStateService);
  private embeddedViewRef: EmbeddedViewRef<any> | null = null;
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  constructor() {
    effect(() => {
      const open = this.state.open();
      if (open) {
        if (!this.embeddedViewRef) {
          // Create a new view without embedding it in the view container
          this.embeddedViewRef = this.templateRef.createEmbeddedView(null);
          this.embeddedViewRef.detectChanges();
        }
        // Attach the view to the view container
        this.viewContainer.insert(this.embeddedViewRef);
      } else {
        if (this.embeddedViewRef) {
          // Detach the view from the view container
          const viewIndex = this.viewContainer.indexOf(this.embeddedViewRef);
          if (viewIndex > -1) {
            this.viewContainer.detach(this.viewContainer.indexOf(this.embeddedViewRef));
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    if (!this.embeddedViewRef) {
      this.embeddedViewRef = this.templateRef.createEmbeddedView(null);
      this.embeddedViewRef.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
    }
  }
}
