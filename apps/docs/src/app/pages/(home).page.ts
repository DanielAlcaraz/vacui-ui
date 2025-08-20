import { Component } from '@angular/core';

@Component({
  selector: 'docs-home',
  standalone: true,
  template: `
    <div class="bg-white">
      <div class="relative isolate px-6 pt-14 lg:px-8">
        <!-- Top background element -->
        <div
          class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-400 to-orange-500 opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style="clip-path: polygon(63% 29%, 93% 45%, 100% 65%, 83% 92%, 61% 100%, 37% 96%, 16% 80%, 0% 57%, 9% 34%, 21% 18%, 40% 9%)"
          ></div>
        </div>

        <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div class="hidden sm:mb-8 sm:flex sm:justify-center">
            <div
              class="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
            >
              Vacui UI is in its early stages.
            </div>
          </div>
          <div class="text-center">
            <h1
              class="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl"
            >
              Vacui UI
            </h1>
            <p
              class="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8"
            >
                Vacui is a headless Angular library of utility-first, primitives, low-level directives as foundational elements.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/docs/overview/index"
                class="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >Get started</a
              >
            </div>
          </div>
        </div>

        <!-- Middle subtle accent -->
        <div
          class="absolute inset-x-0 top-1/2 -z-10 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            class="relative aspect-[1155/678] w-[20rem] left-[calc(50%-20rem)] -translate-y-1/2 bg-gradient-to-r from-amber-200 to-orange-300 opacity-20 sm:w-[30rem]"
            style="clip-path: circle(50% at 50% 50%)"
          ></div>
        </div>

        <!-- Bottom background element -->
        <div
          class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-red-400 to-amber-300 opacity-25 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style="clip-path: polygon(37% 0%, 66% 9%, 90% 29%, 100% 50%, 94% 73%, 77% 91%, 57% 100%, 35% 95%, 17% 81%, 4% 59%, 0% 34%, 12% 12%)"
          ></div>
        </div>
      </div>
    </div>
  `,
})
export default class HomePageComponent {}