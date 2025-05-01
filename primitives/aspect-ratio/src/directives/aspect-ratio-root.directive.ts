import { Directive, ElementRef, OnInit, Renderer2, effect, inject, input } from '@angular/core';

@Directive({
  selector: '[vacAspectRatio]',
  standalone: true,
  exportAs: 'vacAspectRatio',
})
export class AspectRatioRootDirective implements OnInit {
  ratio = input(1, { alias: 'vacAspectRatio' });
  contentStyle = {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  } as const;

  private element = inject(ElementRef).nativeElement;
  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      if (this.ratio()) {
        this.updateAspectRatio();
      }
    });
  }

  ngOnInit() {
    this.renderer.setStyle(this.element, 'position', 'relative');
    this.renderer.setStyle(this.element, 'width', '100%');
  }

  private updateAspectRatio() {
    const paddingBottom = `${100 / this.ratio()}%`;
    this.renderer.setStyle(this.element, 'paddingBottom', paddingBottom);
  }
}
