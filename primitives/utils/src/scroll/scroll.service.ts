import { Injectable, Renderer2, RendererFactory2, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScrollLockService {
  private document = inject<Document>(DOCUMENT);
  private platformId = inject<Object>(PLATFORM_ID);

  private renderer: Renderer2;
  private documentElement: HTMLElement;
  private body: HTMLElement;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const rendererFactory = inject(RendererFactory2);

    this.renderer = rendererFactory.createRenderer(null, null);
    this.documentElement = this.document.documentElement;
    this.body = this.document.body;
  }

  disableScroll(): () => void {
    this.renderer.setAttribute(this.body, 'data-scroll-locked', 'true');
    const scrollbarWidth = this.getScrollbarWidth();
    const scrollbarPadding = this.getScrollbarPadding();
    const paddingProperty = scrollbarPadding.includes('paddingLeft') ? 'paddingLeft' : 'paddingRight';
    const resetScrollbarWidth = this.setProperty(
      this.documentElement,
      '--scrollbar-width',
      `${scrollbarWidth}px`,
    );
    const resetBodyStyle = this.setStyle(this.body, {
      overflow: 'hidden',
      [paddingProperty]: `calc(${scrollbarPadding} + ${scrollbarWidth}px)`,
    });

    let resetIosScroll = () => {};
    if (isPlatformBrowser(this.platformId) && /iPad|iPhone/.test(navigator.userAgent)) {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const visualViewport = (window as any).visualViewport;
      const offsetLeft = visualViewport?.offsetLeft ?? 0;
      const offsetTop = visualViewport?.offsetTop ?? 0;
      resetIosScroll = this.setStyle(this.body, {
        position: 'fixed',
        overflow: 'hidden',
        top: `${-(scrollY - Math.floor(offsetTop))}px`,
        left: `${-(scrollX - Math.floor(offsetLeft))}px`,
        right: '0',
        [paddingProperty]: `calc(${scrollbarPadding} + ${scrollbarWidth}px)`,
      });
    }

    return this.enableScroll(resetScrollbarWidth, resetBodyStyle, resetIosScroll);
  }

  private setStyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>): () => void {
    const originalStyles = new Map<string, string>();
    for (const [key, value] of Object.entries(styles)) {
      originalStyles.set(key, el.style.getPropertyValue(key));
      this.renderer.setStyle(el, key, value);
    }
    return () => {
      for (const [key, value] of originalStyles) {
        if (value) {
          this.renderer.setStyle(el, key, value);
        } else {
          this.renderer.removeStyle(el, key);
        }
      }
    };
  }

  private setProperty(el: HTMLElement, property: string, value: string): () => void {
    const originalValue = el.style.getPropertyValue(property);
    this.renderer.setStyle(el, property, value);
    return () => {
      if (originalValue) {
        this.renderer.setStyle(el, property, originalValue);
      } else {
        this.renderer.removeStyle(el, property);
      }
    };
  }

  private getScrollbarWidth(): number {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth - this.documentElement.clientWidth;
    }
    return 0;
  }

  private getScrollbarPadding(): string {
    if (isPlatformBrowser(this.platformId)) {
      const isRTL = this.documentElement.getBoundingClientRect().left > 0;
      return window.getComputedStyle(this.body)[isRTL ? 'paddingLeft' : 'paddingRight'];
    }
    return '0px';
  }

  private enableScroll(
    resetScrollbarWidth?: () => void,
    resetBodyStyle?: () => void,
    resetIosScroll?: () => void,
  ): () => void {
    return () => {
      resetScrollbarWidth?.();
      resetBodyStyle?.();
      resetIosScroll?.();
      this.renderer.removeAttribute(this.body, 'data-scroll-locked');
    };
  }
}
