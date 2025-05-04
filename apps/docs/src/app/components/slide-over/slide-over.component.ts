import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBars3, heroXMark } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'docs-slideover',
  standalone: true,
  imports: [NgIconComponent],
  providers: [provideIcons({ heroBars3, heroXMark })],
  template: `
    <div class="flex items-center justify-between p-2">
      <button
        class="relative rounded-md bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center"
        (click)="toggleOpen()"
      >
        <div class="flex items-center">
          <span class="sr-only">Open panel</span>
          <ng-icon name="heroBars3" size="24" class="h-6 w-6"></ng-icon>
        </div>
      </button>
      <div class="w-full flex justify-end px-4 text-base dark:text-gray-200">
        <span>Vacui UI</span>
        <a href="https://github.com/DanielAlcaraz/vacui-ui" 
           target="_blank" 
           rel="noopener noreferrer"
           class="ml-2 flex items-center">
          <span class="sr-only">GitHub repository</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="h-5 w-5 text-gray-900 dark:text-white">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path>
          </svg>
        </a>
      </div>
    </div>

    <!-- Background backdrop -->
    @if(isOpen) {
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity duration-300 ease-in-out z-50"
      [@fadeInOut]
      (click)="close()"
    ></div>
    }

    <!-- Slide-over panel -->
    @if(isOpen) {
      <div
        class="fixed inset-0 overflow-hidden z-50"
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
        [@slideInOut]
      >
        <div class="absolute inset-0 overflow-hidden">
          <div class="fixed inset-y-0 left-0 flex">
            <div class="w-96">
              <div
                class="h-full flex flex-col bg-gray-100 dark:bg-gray-800 shadow-xl overflow-y-scroll"
              >
                <div class="px-4 py-6">
                  <div class="flex items-start justify-between">
                    <h2
                      class="text-lg font-medium text-gray-900 dark:text-gray-100"
                      id="slide-over-title"
                    >
                      Vacui Docs
                    </h2>
                    <div class="ml-3 h-7 flex items-center">
                      <button
                        type="button"
                        class="rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 flex items-center justify-center"
                        (click)="close()"
                      >
                        <span class="sr-only">Close panel</span>
                        <ng-icon name="heroXMark" size="24" class="h-6 w-6"></ng-icon>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative flex-1 px-4 py-6 sm:px-6">
                  <!-- Replace with your content -->
                  <div class="absolute inset-0">
                    <div class="h-full bg-white dark:bg-gray-800 rounded-lg">
                      <ng-content></ng-content>
                    </div>
                  </div>
                  <!-- /End replace -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('150ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class SlideoverComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    this.close();
  }

  constructor(private el: ElementRef) {}

  toggleOpen() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
    this.updateBodyClass();
  }

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
    this.updateBodyClass();
  }

  private updateBodyClass() {
    if (this.isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
}