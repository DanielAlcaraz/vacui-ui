import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

interface AnatomyNode {
  name: string;
  children?: AnatomyNode[];
}

@Component({
  selector: 'docs-anatomy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="font-sans text-xs w-full max-w-96 dark:text-gray-200">
      <div
        [class]="isRoot() 
          ? 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow p-1'
          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow p-1 m-2 mt-2'"
      >
        <div class="font-medium text-sm p-1 dark:text-gray-100">{{ node().name }}</div>
        @if (hasChildren()) {
          <div class="border-gray-200 dark:border-gray-700">
            @for (child of node().children; track child.name) {
              <docs-anatomy [node]="child" [isRoot]="false" />
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class AnatomyComponent {
  node = input.required<AnatomyNode>();
  isRoot = input(true);

  hasChildren = computed(() => {
    const currentNode = this.node();
    return currentNode.children !== undefined && currentNode.children.length > 0;
  });
}