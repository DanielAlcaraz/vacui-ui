import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  OnInit,
  Type,
} from '@angular/core';
import { CodeHighlightComponent } from '../code/code.component';
import { DemoComponentName, DemoComponentService } from './example.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroDocument, heroClipboard, heroCodeBracket } from '@ng-icons/heroicons/outline';


@Component({
  selector: 'docs-example',
  standalone: true,
  imports: [CodeHighlightComponent, NgComponentOutlet, NgIconComponent],
  providers: [provideIcons({ heroDocument, heroClipboard, heroCodeBracket })],
  template: `
    <div
      class="mb-6 border rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-800/90 dark:border-indigo-500/30 dark:shadow-lg dark:shadow-indigo-900/20 max-w-6xl"
    >
      <div
        class="flex justify-between items-center p-3 border-b dark:border-indigo-500/30 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-indigo-950/70"
      >
        <div class="font-semibold text-gray-800 dark:text-indigo-200 tracking-tight">
          {{ displayName() }}
        </div>
        <div class="flex items-center space-x-2">
          <button
            (click)="copyToClipboard()"
            class="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 dark:text-indigo-200 bg-white dark:bg-gray-700/90 border border-gray-200 dark:border-indigo-500/30 hover:bg-gray-50 dark:hover:bg-indigo-900/30 hover:text-gray-900 dark:hover:text-indigo-100 hover:border-gray-300 dark:hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-blue-500 dark:focus:ring-indigo-500"
            title="Copy code"
          >
            <ng-icon name="heroClipboard" size="16" class="mr-1.5"></ng-icon>
            Copy
          </button>
          <button
            class="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium text-white bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-blue-500 dark:focus:ring-indigo-400"
            (click)="toggleMode()"
            [title]="showCode ? 'View demo' : 'View code'"
          >
            @if (showCode) {
              <ng-icon name="heroDocument" size="16" class="mr-1.5"></ng-icon>
            } 
            @if (!showCode) {
              <ng-icon name="heroCodeBracket" size="16" class="mr-1.5"></ng-icon>
            }
            {{ showCode ? 'Demo' : 'Code' }}
          </button>
        </div>
      </div>

      <!-- Demo View -->
      @if (!showCode) {
      <div class="p-6 py-16 sm:p-28 bg-white dark:bg-gray-800/80 dark:bg-gradient-to-b dark:from-gray-800/90 dark:to-indigo-950/10 flex justify-center items-center w-full">
        @if (component) {
        <ng-container *ngComponentOutlet="component"></ng-container>
        } @if (!component) {
        <div class="flex items-center justify-center h-32 text-gray-500 dark:text-indigo-300">
          <svg
            class="animate-spin h-5 w-5 mr-3 text-blue-500 dark:text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading component...
        </div>
        }
      </div>
      }

      <!-- Code View -->
      @if (showCode) {
      <div class="p-0">
        <!-- TypeScript Code -->
        @if (tsCode) {
        <docs-code [code]="tsCode" language="typescript"></docs-code>
        } @if (!tsCode) {
        <div class="flex items-center justify-center h-32 text-gray-500 dark:text-indigo-300">
          <svg
            class="animate-spin h-5 w-5 mr-3 text-blue-500 dark:text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading code...
        </div>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly demoService = inject(DemoComponentService);

  name = input.required<DemoComponentName>();

  displayName = computed(() => {
    if (!this.name()) return '';

    return this.name()
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });

  component: Type<unknown> | null = null;
  showCode = false;
  tsCode: string | null = null;

  ngOnInit() {
    this.loadComponent();
  }

  private async loadComponent() {
    try {
      // Using the simplified service to load the component
      const { component, tsCode } = await this.demoService.loadComponent(
        this.name()
      );

      this.component = component;
      this.tsCode = tsCode as string;
      this.changeDetector.detectChanges();
    } catch (error) {
      console.error(`Error loading component ${this.name()}:`, error);
    }
  }

  toggleMode() {
    this.showCode = !this.showCode;
    this.changeDetector.detectChanges();
  }

  copyToClipboard() {
    // Simple clipboard copy without Angular CDK dependency
    if (this.tsCode) {
      const textArea = document.createElement('textarea');
      textArea.value = this.tsCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      // Show a toast notification instead of alert
      const toast = document.createElement('div');
      toast.className =
        'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300';
      toast.textContent = 'Code copied to clipboard';
      document.body.appendChild(toast);

      // Remove the toast after 2 seconds
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    }
  }
}
