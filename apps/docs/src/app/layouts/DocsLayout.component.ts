import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { DocPaginationComponent } from '../components/navigation/docs-pagination/docs-pagination.component';
import { DocMenuComponent } from '../components/navigation/left-sidebar-menu/left-sidebar-menu.component';
import { SlideoverComponent } from '../components/slide-over/slide-over.component';
import { WarningBannerComponent } from '../components/banner/banner.component';

@Component({
  standalone: true,
  selector: 'docs-layout',
  imports: [
    DocMenuComponent,
    SlideoverComponent,
    DocPaginationComponent,
    WarningBannerComponent,
  ],
  template: `
    <div class="flex min-h-full flex-col dark:bg-gray-900">
      <docs-warning-banner />
      <header class="shrink-0 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
        <!-- Header content -->
        <div class="block sm:hidden">
          <docs-slideover>
            <docs-menu />
          </docs-slideover>
        </div>
      </header>
      <div class="mx-auto flex w-full max-w-9xl items-start gap-x-8">
        <aside
          class="sticky top-0 hidden w-60 shrink-0 lg:block overflow-y-auto h-screen bg-gray-100 dark:bg-gray-800"
        >
          <docs-menu />
        </aside>
        <main
          class="overflow-x-hidden flex-grow mx-auto w-full px-2 pb-8 sm:px-6 lg:px-6 
         max-w-5xl prose prose-base prose-p:text-base prose-ul:text-base 
         prose-a:text-base prose-table:m-0 prose-headings:tracking-tight 
         prose-headings:font-semibold prose-h1:text-3xl prose-h1:mb-4 
         prose-h1:mt-8 prose-h1:text-gray-900 dark:prose-h1:text-gray-200
         prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-gray-800 
         dark:prose-h2:text-gray-300 prose-h3:text-xl prose-h3:mb-2 
         prose-h3:mt-5 prose-h3:text-gray-700 dark:prose-h3:text-gray-400
         prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
         prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300
         dark:prose-invert prose-code:bg-gray-100 dark:prose-code:bg-gray-800
         prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
         prose-strong:text-gray-900 dark:prose-strong:text-gray-100
         prose-ul:text-gray-600 dark:prose-ul:text-gray-300
         prose-ol:text-gray-600 dark:prose-ol:text-gray-300
         prose-li:text-gray-600 dark:prose-li:text-gray-300
         prose-blockquote:text-gray-500 dark:prose-blockquote:text-gray-400
         prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700
         prose-hr:border-gray-300 dark:prose-hr:border-gray-700
         prose-img:border-gray-200 dark:prose-img:border-gray-700
         prose-table:text-gray-600 dark:prose-table:text-gray-300
         prose-th:text-gray-900 dark:prose-th:text-gray-100
         prose-td:border-gray-300 dark:prose-td:border-gray-700"
        >
          <ng-content></ng-content>
          <docs-navigation [currentUrl]="currentPath()" />
        </main>
        <!-- <aside class="sticky top-8 hidden w-80 shrink-0 xl:block dark:bg-gray-800 dark:text-gray-300"> -->
          <!-- Document navigation component -->
        <!-- </aside> -->
      </div>
    </div>
  `,
})
export class DocLayoutComponent {
  currentPath = signal('');
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath.set(event.url);
      }
    });
  }
}