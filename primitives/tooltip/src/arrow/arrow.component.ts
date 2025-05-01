import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';

@Component({
  selector: 'vac-arrow',
  standalone: true,
  template: `
    <svg
      [attr.width]="width"
      fill="currentColor"
      stroke="currentColor"
      [attr.height]="height"
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

  @Input() width = 10;
  @Input() height = 5;
}
