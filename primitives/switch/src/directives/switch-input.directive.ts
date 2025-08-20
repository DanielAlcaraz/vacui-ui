import {
  Directive,
  OnInit,
  ElementRef,
  inject,
  computed,
  Renderer2,
  Injector,
  OnDestroy,
} from '@angular/core';
import { hostBinding } from '@vacui-kit/primitives/utils';
import { SwitchRootDirective } from './switch-root.directive';

@Directive({
  selector: '[vacSwitchInput]',
  standalone: true,
  exportAs: 'vacSwitchInput',
})
export class SwitchInputDirective implements OnInit, OnDestroy {
  private root = inject(SwitchRootDirective);
  private renderer = inject(Renderer2);
  private injector = inject(Injector);
  private inputElement: HTMLInputElement | null = null;

  ngOnInit() {
    this.inputElement = this.renderer.createElement('input') as HTMLInputElement;
    this.renderer.setAttribute(this.inputElement, 'data-testid', 'input');

    this.applyInputProperties(this.inputElement);

    this.moveInputOutsideButton(this.inputElement);
  }

  ngOnDestroy() {
    if (this.inputElement && this.inputElement.parentNode) {
      this.renderer.removeChild(this.inputElement.parentNode, this.inputElement);
    }
  }

  private applyInputProperties(input: HTMLInputElement) {
    this.renderer.setAttribute(input, 'type', 'checkbox');
    this.renderer.setAttribute(input, 'aria-hidden', 'true');
    this.renderer.setAttribute(input, 'tabindex', '-1');

    hostBinding('attr.checked', this.root.dataState, { element: input, injector: this.injector });
    hostBinding('attr.disabled', this.root.dataDisabled, { element: input, injector: this.injector });
    hostBinding('attr.required', this.root.required, { element: input, injector: this.injector });
    hostBinding('attr.name', this.root.name, { element: input, injector: this.injector });
    hostBinding('attr.value', this.root.value, { element: input, injector: this.injector });

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
