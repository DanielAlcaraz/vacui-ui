import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
  input
} from '@angular/core';

@Component({
  selector: 'vac-arrow',
  standalone: true,
  template: `
    <svg
      [attr.width]="width()"
      fill="currentColor"
      stroke="currentColor"
      [attr.height]="height()"
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      <polygon points="0,0 30,0 15,10"></polygon>
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrowComponent {
  element = inject(ElementRef).nativeElement;

  readonly width = input(10);
  readonly height = input(5);
}
