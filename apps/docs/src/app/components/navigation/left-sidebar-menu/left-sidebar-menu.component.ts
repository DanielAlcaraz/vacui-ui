import { ContentFile, injectContentFiles } from '@analogjs/content';

import { Component, computed, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { DocMenuItemComponent } from './left-sidebar-menu-item.component';

interface PageAttributes {
  title: string;
  order?: number;
  group?: string;
  icon?: string;
}

interface PageMenuItem {
  title: string;
  url: string;
  order?: number;
  icon?: string;
}

@Component({
  selector: 'docs-menu',
  standalone: true,
  imports: [DocMenuItemComponent],
  template: `
    <nav class="flex flex-1 flex-col h-full bg-gray-100 dark:bg-gray-800 pr-2 py-4">
      <ul
        role="list"
        class="flex flex-1 flex-col gap-y-6 overflow-y-auto px-4 sm:px-6 lg:px-6"
        >
        @for (item of ungroupedMenuItems(); track item) {
          <docs-menu-item
            [title]="item.title"
            [url]="item.url"
            [icon]="item.icon"
            [isActive]="isActive(item.url)"
            (itemClicked)="onMenuItemClick()"
          ></docs-menu-item>
        }
        @for (group of groupConfig; track group) {
          <li>
            <span class="text-base leading-6 text-gray-500 dark:text-gray-400 px-2 w-full text-left">
              {{ group.label }}
            </span>
            <ul class="mt-1 space-y-1">
              @for (item of groupedMenuItems()[group.label]; track item) {
                <docs-menu-item
                  [title]="item.title"
                  [url]="item.url"
                  [icon]="item.icon"
                  [isActive]="isActive(item.url)"
                  (itemClicked)="onMenuItemClick()"
                ></docs-menu-item>
              }
            </ul>
          </li>
        }
      </ul>
    </nav>
    `,
})
export class DocMenuComponent {
  private router = inject(Router);
  private basePath = '/docs/';

  menuItemClicked = output<void>();

  groupConfig = [
    { label: 'Overview', folder: 'overview' },
    { label: 'Directives', folder: 'directives' },
  ];

  docPages = injectContentFiles<PageAttributes>((contentFile: ContentFile) =>
    contentFile.filename.includes(this.basePath)
  );

  ungroupedMenuItems = computed(() => this.processDocPages().ungrouped);
  groupedMenuItems = computed(() => this.processDocPages().grouped);

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  onMenuItemClick() {
    this.menuItemClicked.emit();
  }

  private processDocPages() {
    const groupedMenu: {
      [label: string]: PageMenuItem[];
    } = {};

    this.groupConfig.forEach((config) => {
      groupedMenu[config.label] = [];
    });

    const ungroupedMenu: PageMenuItem[] = [];

    this.docPages.forEach((page) => {
      const { title, order, group, icon } = page.attributes;

      // Create the URL based on the file path
      const url = this.createUrl(page.filename);

      const menuItem: PageMenuItem = { title, url, order, icon };

      const matchingGroup = this.groupConfig.find((g) =>
        page.filename.includes(`${this.basePath}${g.folder}/`)
      );
      if (matchingGroup) {
        groupedMenu[matchingGroup.label].push(menuItem);
      } else {
        ungroupedMenu.push(menuItem);
      }
    });

    // Sort the items in each group and the ungrouped items
    for (const group in groupedMenu) {
      groupedMenu[group].sort(this.sortItems);
    }
    ungroupedMenu.sort(this.sortItems);

    return {
      grouped: groupedMenu,
      ungrouped: ungroupedMenu,
    };
  }

  private createUrl(filename: string): string {
    // Find the index of '/docs/' in the filename
    const docsIndex = filename.indexOf(this.basePath);
    if (docsIndex === -1) {
      console.error('Unexpected file path structure:', filename);
      return this.basePath;
    }

    // Extract the path starting from 'docs/'
    const path = filename.slice(docsIndex + 1);

    // Remove the file extension
    const pathWithoutExtension = path.replace(/\.(md|mdx|agx)$/, '');

    // Construct the URL, ensuring it starts with a '/'
    return `/${pathWithoutExtension}`;
  }

  private sortItems(a: PageMenuItem, b: PageMenuItem): number {
    // If both items have an order, sort by order
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }

    // If only one item has an order, prioritize it
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;

    // If neither has an order, sort alphabetically by title
    return a.title.localeCompare(b.title);
  }
}
