import { AnimationBuilder, animate, style } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Renderer2, viewChild, viewChildren } from '@angular/core';
import { TabsPrimitivesModule } from '../src/tabs.module';
import { Orientation } from '../src/models/tabs.model';

@Component({
  selector: 'vacui-ui-tabs',
  standalone: true,
  imports: [CommonModule, TabsPrimitivesModule],
  template: `
    <div vacTabsRoot [value]="selectedTab" [orientation]="orientation" (valueChange)="selectTab($event)">
      <nav
        vacTabsList
        [loop]="false"
        aria-label="Manage your account"
        class="isolate flex divide-x divide-gray-200 rounded-lg shadow relative"
      >
        @for (tab of tabDefinitions; track tab.id) {
          <button
            #tabsTrigger
            class="text-gray-900 rounded-lg group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:outline-none focus:bg-indigo-50"
            [vacTabsTrigger]="tab.id"
            [disabled]="tab.disabled"
          >
            <span>{{ tab.title }}</span>
          </button>
        }
        <span #indicator class="absolute bottom-0 h-0.5 bg-indigo-500 z-10"></span>
      </nav>

      <div *vacTabsContent="'tab1'" class="p-4 z-20">Content 1</div>
      <div *vacTabsContent="'tab2'" class="p-4 z-20">Content 2</div>
      <div *vacTabsContent="'tab3'" class="p-4 z-20">Content 3</div>
    </div>
  `,
})
export class TabsComponent implements AfterViewInit {
  protected tabButtons = viewChildren<ElementRef>('tabsTrigger');
  protected indicator = viewChild.required<ElementRef>('indicator');

  selectedTab: string | null = 'tab1';
  orientation: Orientation = 'horizontal';
  tabDefinitions = [
    { title: 'Tab 1', id: 'tab1', disabled: false },
    { title: 'Tab 2', id: 'tab2', disabled: false },
    { title: 'Tab 3', id: 'tab3', disabled: true },
  ];

  constructor(
    private animBuilder: AnimationBuilder,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    this.moveActiveTab(false);
  }

  selectTab(tabValue: string | null) {
    console.log(tabValue);
    this.selectedTab = tabValue;
    this.moveActiveTab();
  }

  moveActiveTab(loadAnimation = true) {
    const activeTabElement = this.tabButtons().find(
      (btn, index) => this.tabDefinitions[index].id === this.selectedTab,
    )?.nativeElement;

    if (activeTabElement) {
      const width = activeTabElement.offsetWidth + 'px';
      const offsetX = activeTabElement.offsetLeft + 'px';

      if (!loadAnimation) {
        this.renderer.setStyle(this.indicator().nativeElement, 'width', width);
        this.renderer.setStyle(this.indicator().nativeElement, 'transform', `translateX(${offsetX})`);
        return;
      }

      const animation = this.animBuilder.build([
        animate('150ms ease', style({ width, transform: `translateX(${offsetX})` })),
      ]);

      const player = animation.create(this.indicator().nativeElement);
      player.play();
    }
  }
}
