import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[vacPortal]',
  standalone: true,
})
export class PortalDirective implements AfterViewInit, OnDestroy {
  @Input('vacPortal') customTarget: string | HTMLElement | null | 'parent' = null;
  private embeddedViewRef!: EmbeddedViewRef<any>;
  private readonly document = inject(DOCUMENT);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private appRef = inject(ApplicationRef);
  private renderer = inject(Renderer2);
  private targetElement: HTMLElement | null = null;
  private platform = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform)) {
      this.viewContainerRef.clear();
      this.targetElement = this.determineTargetElement();
      this.embeddedViewRef = this.templateRef.createEmbeddedView({});

      if (this.targetElement) {
        this.embeddedViewRef.rootNodes.forEach((node) => {
          this.appRef.attachView(this.embeddedViewRef);
          this.renderer.appendChild(this.targetElement, node);
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.embeddedViewRef) {
      this.appRef.detachView(this.embeddedViewRef);
      this.embeddedViewRef.destroy();
    }
  }

  private determineTargetElement(): HTMLElement {
    if (typeof this.customTarget === 'string') {
      if (this.customTarget === 'parent') {
        const hostElement = this.viewContainerRef.element.nativeElement;
        return (hostElement.parentNode as HTMLElement) || this.document.body;
      } else {
        const target = this.document.querySelector(this.customTarget);
        if (target instanceof HTMLElement) {
          return target;
        }
        console.warn(`No element found for the selector: '${this.customTarget}'`);
      }
    } else if (this.customTarget instanceof HTMLElement) {
      return this.customTarget;
    }

    return this.document.body;
  }
}
