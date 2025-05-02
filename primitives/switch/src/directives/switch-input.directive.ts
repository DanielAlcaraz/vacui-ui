import {
  Directive,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  inject,
  computed,
  Renderer2,
  afterNextRender,
  Injector,
  AfterRenderPhase,
} from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { SwitchRootDirective } from './switch-root.directive';

@Directive({
  selector: '[vacSwitchInput]',
  standalone: true,
  exportAs: 'vacSwitchInput',
})
export class SwitchInputDirective {
  private root = inject(SwitchRootDirective);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private injector = inject(Injector);

  constructor() {
    afterNextRender(
      () => {
        const embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        const inputElement = embeddedViewRef.rootNodes[0] as HTMLInputElement;

        // Apply properties and styles
        this.applyInputProperties(inputElement);

        // Move the input to the correct position
        this.moveInputOutsideButton(inputElement);
      },
      { phase: AfterRenderPhase.Write },
    );
  }

  private applyInputProperties(input: HTMLInputElement) {
    this.renderer.setAttribute(input, 'type', 'checkbox');
    this.renderer.setAttribute(input, 'aria-hidden', 'true');
    this.renderer.setAttribute(input, 'tabindex', '-1');

    hostBinding('checked', this.root.dataState, { element: input, injector: this.injector });
    hostBinding('disabled', this.root.dataDisabled, { element: input, injector: this.injector });
    hostBinding('required', this.root.required, { element: input, injector: this.injector });
    hostBinding('name', this.root.name, { element: input, injector: this.injector });
    hostBinding('value', this.root.value, { element: input, injector: this.injector });

    const styles = computed(() => ({
      transform: 'translateX(-100%)',
      position: 'absolute',
      'pointer-events': 'none',
      opacity: '0',
      margin: '0px',
      width: '42px',
      height: '25px',
    }));

    hostBinding('style', styles, { element: input, injector: this.injector });
  }

  private moveInputOutsideButton(input: HTMLInputElement) {
    const rootElement = this.root.element;
    const parentElement = rootElement.parentElement;

    if (parentElement) {
      this.renderer.insertBefore(parentElement, input, rootElement.nextSibling);
    }
  }
}
