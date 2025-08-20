import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  Directive,
  EmbeddedViewRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  inject,
  input
} from '@angular/core';

@Directive({
  selector: '[vacPortal]',
  standalone: true,
})
export class PortalDirective implements AfterViewInit, OnDestroy {
  readonly customTarget = input<string | HTMLElement | null | 'parent'>(null, { alias: "vacPortal" });
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
    const customTarget = this.customTarget();
    if (typeof customTarget === 'string') {
      if (customTarget === 'parent') {
        const hostElement = this.viewContainerRef.element.nativeElement;
        return (hostElement.parentNode as HTMLElement) || this.document.body;
      } else {
        const target = this.document.querySelector(customTarget);
        if (target instanceof HTMLElement) {
          return target;
        }
        console.warn(`No element found for the selector: '${customTarget}'`);
      }
    } else if (customTarget instanceof HTMLElement) {
      return customTarget;
    }

    return this.document.body;
  }
}
