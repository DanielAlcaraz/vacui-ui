import { Component, input, model } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CollapsiblePrimitivesModule } from '../src/collapsible.module';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroChevronUp } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'vac-collapsible',
  standalone: true,
  imports: [CollapsiblePrimitivesModule, NgIconComponent],
  viewProviders: [provideIcons({ heroChevronDown, heroChevronUp })],
  template: `
    <div
      vacCollapsibleRoot
      [(open)]="open"
      [disabled]="disabled()"
      class="max-w-md mx-auto transition-all ease-in-out duration-300 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
    >
      <div class="flex items-center justify-between p-4 bg-orange-600 text-white">
        <h3 class="text-lg font-semibold">
          Historical Event: Julius Caesar crosses the Rubicon
        </h3>
        <button
          vacCollapsibleTrigger
          aria-label="Toggle details"
          class="flex items-center justify-center p-2 rounded-full bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <ng-icon [name]="open() ? 'heroChevronUp' : 'heroChevronDown'" class="h-5 w-5"></ng-icon>
        </button>
      </div>
      <div vacCollapsibleContent [@contentAnimation]="open() ? 'show' : 'hide'" class="text-sm leading-6 text-gray-700">
        <p class="p-4 border-t border-gray-200">
          The crossing of the Rubicon was a pivotal event that led Julius Caesar to march into Rome and seize power, marking the start of civil war and the eventual rise of the Roman Empire.
        </p>
        <div class="p-4 border-t border-gray-200">
          <h4 class="font-medium text-gray-900">Key Moments:</h4>
          <ul class="mt-2 pl-4 list-disc list-inside text-orange-600">
            <li>Battle of Actium</li>
            <li>Foundation of Rome</li>
            <li>Roman Senate in session</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('contentAnimation', [
      state('hide', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('show', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('show <=> hide', animate('200ms ease-in-out')),
    ]),
  ],
})
export class CollapsibleComponent {
  readonly open = model(false);
  readonly disabled = input(false);
}
