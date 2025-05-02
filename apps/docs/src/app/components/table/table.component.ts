import { Component, computed, input } from '@angular/core';

interface Column {
  header: string;
  field: string;
  widthFactor?: number;
}

@Component({
  selector: 'docs-table',
  standalone: true,
  template: `
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div
          class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 sm:rounded-lg border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
        >
          <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                @for (column of columns(); track column.field) {
                <th
                  scope="col"
                  class="px-3 p-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  [style]="dynamicWidth(column.widthFactor)"
                >
                  {{ column.header }}
                </th>
                }
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              @for (row of rows(); track $index) {
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                @for (column of columns(); track column.field) {
                <td
                  class="whitespace-nowrap p-2 px-3 text-sm text-gray-500 dark:text-gray-300 min-w-28 sm:max-w-36 text-wrap"
                  [style]="dynamicWidth(column.widthFactor)"
                >
                  {{ row[column.field] }}
                </td>
                }
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class TableComponent {
  // Input signals for columns and rows
  columns = input<Column[]>([]);
  rows = input<any[]>([]);

  totalWidthFactor = computed(() =>
    this.columns().reduce((sum, { widthFactor = 1 }) => sum + widthFactor, 0)
  );

  dynamicWidth(widthFactor = 1): string {
    const widthPercentage = (widthFactor / this.totalWidthFactor()) * 100;
    return `width: ${widthPercentage}%`;
  }
}