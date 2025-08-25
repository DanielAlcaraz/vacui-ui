
import { Component, AfterContentInit, ElementRef, signal, effect, inject, input, contentChildren } from '@angular/core';

import { TabContentComponent } from './tab-content.component';

@Component({
  selector: 'app-tabs-container',
  standalone: true,
  imports: [TabContentComponent],
  template: `
    <div class="tabs-container">
      <div class="relative flex border-b border-gray-300">
        @for (tab of tabs(); track tab; let i = $index) {
          <button
            class="tab-button px-4 py-3 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none"
            [class.text-orange-600]="activeTabIndex() === i"
            (click)="setActiveTab(i)"
            type="button"
          >
            {{ tab }}
          </button>
        }
        <div
          #underline
          class="active-underline absolute left-0 bottom-0 h-0.5 bg-orange-600 transition-all duration-200 ease-in-out"
          [style.width.px]="underlineWidth()"
          [style.left.px]="underlineLeft()"
        ></div>
      </div>
      <div class="tab-content-area pt-4">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class TabsContainerComponent implements AfterContentInit {
  private elementRef = inject(ElementRef);

  readonly tabs = input.required<string[]>();
  readonly tabContents = contentChildren(TabContentComponent);
  
  activeTabIndex = signal(0);
  underlineWidth = signal(0);
  underlineLeft = signal(0);

  ngAfterContentInit() {
    this.updateTabVisibility();
    this.updateUnderline();

    effect(() => {
      this.updateTabVisibility();
      this.updateUnderline();
    });
  }

  setActiveTab(index: number) {
    this.activeTabIndex.set(index);
  }

  private updateTabVisibility() {
    this.tabContents().forEach((content, index) => {
      content.isActive.set(index === this.activeTabIndex());
    });
  }

  private updateUnderline() {
    const buttons = this.elementRef.nativeElement.querySelectorAll('.tab-button');
    const activeButton = buttons[this.activeTabIndex()];
    if (activeButton) {
      this.underlineWidth.set(activeButton.clientWidth);
      this.underlineLeft.set(activeButton.offsetLeft);
    }
  }
}