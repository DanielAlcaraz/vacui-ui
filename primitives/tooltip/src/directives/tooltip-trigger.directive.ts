import { AfterViewInit, Directive, ElementRef, Injector, OnInit, Renderer2, effect, inject, untracked } from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { TooltipService } from '../controller/tooltip.service';

@Directive({
  selector: '[vacTooltipTrigger]',
  standalone: true,
  exportAs: 'vacTooltipTrigger',
})
export class TooltipTriggerDirective implements AfterViewInit {
  state = inject(TooltipService);
  private element = inject(ElementRef).nativeElement;
  private renderer = inject(Renderer2);
  private injector = inject(Injector);

  constructor() {
    this.state.trackElement(this.element);
    this.renderer.setAttribute(this.element, 'aria-describedby', this.state.id);
    hostBinding('attr.data-state', this.state.openState);
  }
  
  ngAfterViewInit(): void {
    effect(() => {
      if (this.state.open()) {
        untracked(() => this.state.activateTooltip(this.element));
      } else if (this.state.mouseHover() && !this.state.open()) {
        untracked(() => this.state.activateTooltip(this.element));
      } else {
        untracked(() => this.state.deactivateTooltip());
      }
    }, { injector: this.injector });
  }
}
