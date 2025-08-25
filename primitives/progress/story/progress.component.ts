import { AfterViewInit, ChangeDetectionStrategy, Component, computed, OnDestroy, signal } from '@angular/core';
import { ProgressPrimitivesModule } from '@vacui-kit/primitives/progress';

@Component({
  selector: 'vac-progress',
  standalone: true,
  imports: [ProgressPrimitivesModule],
  template: `
    <div
      vacProgressRoot
      [value]="value()"
      [max]="max()"
      aria-label="Progress Status"
      class="relative h-6 w-72 overflow-hidden rounded-full bg-gray-300"
    >
      <div
        [style.transform]="translateX()"
        vacProgressIndicator
        class="h-full w-full bg-gray-800 transition-transform duration-300 ease-out"
      ></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressComponent implements AfterViewInit, OnDestroy {
  value = signal(1);
  max = signal(50);

  protected translateX = computed(() => `translateX(-${100 - (100 * this.value()) / this.max()}%)`);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngAfterViewInit(): void {
    this.startProgress();
  }

  private startProgress(): void {
    this.intervalId = setInterval(() => {
      if (this.value() < this.max()) {
        this.value.update(prevValue => (Math.min(prevValue + 1, this.max())));
      } else {
        this.stopProgress();
      }
    }, 100);
  }

  private stopProgress(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    this.stopProgress();
  }
}
