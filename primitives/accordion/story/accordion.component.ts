import { Component, input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMinus, heroPlus } from '@ng-icons/heroicons/outline';
import { AccordionPrimitivesModule } from '@vacui-kit/primitives/accordion';

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  open?: boolean;
}

@Component({
  selector: 'vacui-ui-accordion',
  standalone: true,
  imports: [AccordionPrimitivesModule, NgIconComponent],
  viewProviders: [provideIcons({ heroMinus, heroPlus })],
  template: `
    <div
      vacAccordionRoot
      [multiple]="multiple()"
      [value]="initialOpen()"
      [collapsible]="collapsible()"
      [disabled]="disabled()"
      [orientation]="orientation()"
      (valueChange)="valueChange($event)"
      class="flex flex-col"
    >
      @for (accordion of items(); track $index) {
        <div
          vacAccordionItem
          #item="vacAccordionItem"
          [value]="accordion.id"
          [disabled]="false"
          class="overflow-hidden transition-colors border-t border-x border-gray-300 last:border-b first:rounded-t-xl last:rounded-b-xl focus-within:relative focus-within:z-10 focus-within:ring focus:ring-1 focus-within:ring-gray-300/50"
        >
          <h3 vacAccordionHeader="2" class="flex m-0">
            <button
              vacAccordionTrigger
              class="flex h-12 flex-1 cursor-pointer items-center justify-between bg-white text-lg px-4 font-medium leading-none text-gray-900 transition-colors hover:bg-opacity-95 focus:outline-none"
            >
              {{ accordion.title }}
              <div class="p-0.5 border rounded-sm">
                <ng-icon [name]="item.state.isActive(accordion.id)? 'heroMinus' : 'heroPlus'" class="h-4 w-4"></ng-icon>
              </div>
            </button>
          </h3>
          <div
            vacAccordionContent
            class="bg-gray-100 shadow-inner text-gray-950 overflow-hidden"
            [@contentExpansion]="item.state.isActive(accordion.id)"
          >
            <div class="p-4 text-base">
              <p>{{ accordion.description }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('contentExpansion', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0' })),
      transition('false <=> true', [
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ]),
    ]),
  ],
  styles: [],
})
export class AccordionComponent {
  readonly initialOpen = input(['item-1']);
  readonly multiple = input(true);
  readonly collapsible = input(false);
  readonly disabled = input(false);
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly items = input<AccordionItem[]>([
    {
        id: 'item-1',
        title: 'Why is it called Vacui UI?',
        description: 'Vacui comes from Latin. It is the plural of Vacuus and it means void or emptiness. Making a reference to the headless system.',
    },
    {
        id: 'item-2',
        title: 'Why do we use directives?',
        description: 'Directives are a powerful way to interact with the DOM. We want to give you the most flexible solution to create your own components.',
    },
    {
        id: 'item-3',
        title: 'What are you waiting for?',
        description: 'Start using Vacui or contact us for any help.',
    },
]);

  valueChange(value: string | string[] | null) {
    console.log(value);
  }
}
