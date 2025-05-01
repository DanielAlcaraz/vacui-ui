import { ContentFile, injectContentFiles } from '@analogjs/content';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DocPage {
  url: string;
  title: string;
  group?: string;
  order?: number;
}

@Component({
  selector: 'docs-navigation',
  standalone: true,
  imports: [RouterLink],
  template: `
    @let previousDocument = prevDoc(); @let nextDocument = nextDoc();

    <div class="mt-8 flex justify-between items-center">
      @if (previousDocument) {
      <div>
        <div>Previous</div>
        <a
          [routerLink]="previousDocument.url"
          (click)="scrollTopOnNavigate()"
          class="flex items-center transition-colors duration-200"
        >
          <span>{{ previousDocument.title }}</span>
        </a>
      </div>
      } @else {
      <div></div>

      } @if (nextDocument) {
      <div class="text-right">
        <div>Next</div>
        <a
          [routerLink]="nextDocument.url"
          (click)="scrollTopOnNavigate()"
          class="flex items-center transition-colors duration-200"
        >
          <span>{{ nextDocument.title }}</span>
        </a>
      </div>
      }
    </div>
  `,
})
export class DocPaginationComponent {
  currentUrl = input.required<string>();
  prevDoc = computed<DocPage | null>(() => {
    const activeRoute = this.currentUrl();
    if (activeRoute) {
      const currentIndex = this.docPages.findIndex(
        (doc) => doc.url === activeRoute
      );
      return this.docPages[currentIndex - 1] || null;
    }

    return null;
  });

  nextDoc = computed<DocPage | null>(() => {
    const activeRoute = this.currentUrl();
    if (activeRoute) {
      const currentIndex = this.docPages.findIndex(
        (doc) => doc.url === activeRoute
      );
      return this.docPages[currentIndex + 1] || null;
    }

    return null;
  });

  private contentFiles = injectContentFiles<DocPage>((file) =>
    file.filename.includes('/src/content/docs/')
  );
  private docPages: DocPage[] = this.mapContentFilesToDocPages(
    this.contentFiles
  );

  private mapContentFilesToDocPages(
    contentFiles: ContentFile<DocPage>[]
  ): DocPage[] {
    return contentFiles
      .sort((a, b) => this.getSortKey(a).localeCompare(this.getSortKey(b)))
      .map((file) => ({
        url: `${file.filename
          .split('/content')[1]
          .replace(/\.(md|mdx|agx)$/, '')}`,
        title: file.attributes.title,
        group: file.attributes.group,
        order: file.attributes.order,
      }));
  }

  private getSortKey(doc: ContentFile<DocPage>): string {
    const groupConfig = [
      { label: 'Introduction', folder: '' },
      { label: 'Overview', folder: 'overview' },
      { label: 'Directives', folder: 'directives' },
    ];

    let groupIndex = groupConfig.findIndex(
      (group) => doc.attributes.group === group.label
    );
    if (groupIndex === -1) groupIndex = 0;
    const docOrder = doc.attributes.order ?? 9999;

    return `${groupIndex}-${docOrder.toString().padStart(3, '0')}`;
  }

  protected scrollTopOnNavigate() {
    // Scroll to top when navigation component is initialized/updated
    window.scrollTo(0, 0);
  }
}
