import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PortalDirective } from '@vacui-ui/primitives/portal';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  DialogRootDirective,
  DialogCloseDirective,
  DialogContentDirective,
  DialogDescriptionDirective,
  DialogOverlayDirective,
  DialogTitleDirective,
  DialogTriggerDirective,
} from '@vacui-ui/primitives/dialog';

@Component({
  selector: 'vac-dialog',
  standalone: true,
    imports: [
    DialogRootDirective,
    DialogCloseDirective,
    DialogContentDirective,
    DialogDescriptionDirective,
    DialogOverlayDirective,
    DialogTitleDirective,
    DialogTriggerDirective,
    PortalDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
  <div vacDialogRoot>
    <button vacDialogTrigger class="bg-blue-500 text-white py-2 px-4 rounded">Open Parent Dialog</button>
    <ng-container *vacPortal>
      <div *vacDialogOverlay class="fixed inset-0 bg-black bg-opacity-50" [@overlay]></div>
      <div
        *vacDialogContent
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-96"
        [@content]
      >
        <h2 vacDialogTitle class="text-2xl font-bold mb-4">Parent Dialog</h2>
        <p vacDialogDescription class="mb-4">This is the parent dialog content.</p>
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="mt-2">
            <input
              class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <!-- Nested dialog -->
        <div vacDialogRoot class="mt-4">
          <button vacDialogTrigger class="bg-green-500 text-white py-2 px-4 rounded">Open Child Dialog</button>
          <ng-container *vacPortal>
            <div *vacDialogOverlay class="fixed inset-0 bg-black bg-opacity-50" [@overlay]></div>
            <div
              *vacDialogContent
              class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-80"
              [@content]
            >
              <h2 vacDialogTitle class="text-xl font-bold mb-4">Child Dialog</h2>
              <p vacDialogDescription class="mb-4">This is the child dialog content.</p>
              <button vacDialogClose aria-label="close" class="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded">Close Child Dialog</button>
            </div>
          </ng-container>
        </div>
        
        <button vacDialogClose aria-label="close" class="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded">Close Parent Dialog</button>
      </div>
    </ng-container>
  </div>
</div>
  `,
  animations: [
    trigger('overlay', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [style({ opacity: 0 }), animate('150ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('100ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('content', [
      state('void', style({ opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'translate(-50%, -50%) scale(1)' })),
      ])
    ]),
  ],
})
export class DialogComponent {}
