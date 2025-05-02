import { Directive, Renderer2, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { TabsStateService } from '../state/tabs-state.service';
import { ActivationState } from '../models/tabs.model';

@Directive({
  selector: '[vacTabsContent]',
  exportAs: 'vacTabsContent',
  standalone: true,
})
export class TabsContentDirective {
  value = input.required<string>({ alias: 'vacTabsContent' });
  state = inject(TabsStateService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private htmlElementRef!: HTMLElement | null;

  constructor() {
    effect(() => {
      if (this.state.value() === this.value() && !this.htmlElementRef) {
        this.templateRef.elementRef.nativeElement;
        const embeddedView = this.viewContainer.createEmbeddedView(this.templateRef);
        this.htmlElementRef = embeddedView.rootNodes[0] as HTMLElement;
        this.setAttributes(this.htmlElementRef);
        this.setDataAttributes(this.htmlElementRef);
      } else if (this.state.value() !== this.value() && this.htmlElementRef) {
        this.viewContainer.clear();
        this.htmlElementRef = null;
      }
    });
  }

  private setDataAttributes(element: HTMLElement) {
    this.renderer.setAttribute(element, 'data-orientation', this.state.orientation());
    const tabState: ActivationState = this.value() === this.state.value() ? 'active' : 'inactive';
    this.renderer.setAttribute(element, 'data-state', tabState);
  }

  private setAttributes(element: HTMLElement) {
    this.renderer.setAttribute(element, 'role', 'tabpanel');
    this.renderer.setAttribute(element, 'tabindex', '0');
    this.renderer.setAttribute(element, 'aria-labelledby', `tabpanel-${this.value()}`);
    this.renderer.setAttribute(element, 'id', `tabpanel-${this.value()}`);
  }
}
