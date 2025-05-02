import { Component } from '@angular/core';

@Component({
  selector: 'docs-warning-banner',
  standalone: true,
  template: `
    <div
      class="flex items-center justify-between gap-x-6 bg-orange-500 px-6 py-2.5 sm:px-3.5"
      role="alert"
      aria-live="polite"
    >
      <div class="flex-1 text-center sm:text-left">
        <p class="text-base font-semibold leading-6 text-white">
          Vacui UI is a personal project under active development and may
          contain incomplete features. Thanks for checking it out!
        </p>
      </div>
    </div>
  `,
})
export class WarningBannerComponent {}
