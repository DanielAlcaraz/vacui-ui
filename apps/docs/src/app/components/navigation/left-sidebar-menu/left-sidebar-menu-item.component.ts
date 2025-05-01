import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'docs-menu-item',
  standalone: true,
  template: `
    <li>
      <a [href]="url()" [class]="linkClass()">
        <!-- <Icon
          *ngIf="icon()"
          [name]="'heroicons:' + icon()"
          class="h-6 w-6 shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-orange-600"
        /> -->
        {{ title() }}
      </a>
    </li>
  `,
})
export class DocMenuItemComponent {
  title = input('');
  url = input('');
  icon = input<string | undefined>();
  isActive = input(false);

  linkClass = computed(
    () => {
      // Base classes for both light and dark modes
      const baseClasses = 'group flex items-center gap-x-3 rounded-md p-2 text-base font-medium';
      
      if (this.isActive()) {
        // Active state
        return `${baseClasses} 
                text-orange-500 bg-white hover:text-orange-600 hover:bg-gray-50 border border-orange-600 
                dark:text-gray-100 dark:bg-gray-700 dark:hover:text-gray-100 dark:hover:bg-gray-600 dark:border-gray-500`;
      } else {
        // Inactive state
        return `${baseClasses} 
                text-gray-700 hover:text-orange-600 hover:bg-gray-50 
                dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300`;
      }
    }
  );
}
