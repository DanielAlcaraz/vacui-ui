import { Component, AfterViewInit, Renderer2, ElementRef, input, inject } from '@angular/core';

interface MarkdownHeading {
  depth: number;
  slug: string;
  text: string;
}

@Component({
  selector: 'docs-navigation',
  standalone: true,
  template: `
    <nav class="overflow-y-auto bg-white dark:bg-gray-900" id="doc-side-nav">
      <ul class="space-y-0.5 bg-gray-50 p-4 rounded-lg shadow dark:bg-gray-800">
        @for (heading of headings(); track heading.slug) {
          <li [class]="depthToPaddingClass(heading.depth) + ' py-1'">
            <a
              [href]="'#' + heading.slug"
              class="block text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out dark:text-blue-400 dark:hover:text-blue-500"
              [attr.data-heading-id]="heading.slug"
            >
              {{ heading.text }}
            </a>
          </li>
        }
      </ul>
    </nav>
  `
})
export class DocHeadersNavComponent implements AfterViewInit {
  headings = input.required<MarkdownHeading[]>();
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);

  depthToPaddingClass(depth: number): string {
    switch (depth) {
      case 1: return "pl-4";
      case 2: return "pl-8";
      case 3: return "pl-12";
      default: return "pl-12";
    }
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        let currentId = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            currentId = entry.target.getAttribute("id");
          }
        });

        if (currentId) {
          this.el.nativeElement.querySelectorAll("ul a").forEach((link: Element) => {
            this.renderer.removeClass(link, "text-blue-800");
            this.renderer.removeClass(link, "font-semibold");
            this.renderer.addClass(link, "text-blue-600");
          });
          const activeLink = this.el.nativeElement.querySelector(
            `nav a[href="#${currentId}"]`
          );
          if (activeLink) {
            this.renderer.addClass(activeLink, "text-blue-800");
            this.renderer.addClass(activeLink, "font-semibold");
            this.renderer.removeClass(activeLink, "text-blue-600");
          }
        }
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.1,
      }
    );

    // Track all headings
    document
      .querySelectorAll("article h1, article h2, article h3")
      .forEach((heading) => {
        observer.observe(heading);
      });
  }
}
