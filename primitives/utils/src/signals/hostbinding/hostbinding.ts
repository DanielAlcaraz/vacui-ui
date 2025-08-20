import {
  effect,
  ElementRef,
  HostBinding,
  inject,
  Injector,
  Renderer2,
  RendererStyleFlags2,
  runInInjectionContext,
  Signal,
  WritableSignal,
} from '@angular/core';

function convertStyleObjectToString(styleObj: Record<string, string | number>): string {
  const cssString = Object.entries(styleObj)
    .map(([property, value]) => {
      let formattedValue = value;
      if (typeof value === 'number') {
        formattedValue = value === 0 ? '0' : `${value}px`;
      }
      return `${property}: ${formattedValue};`;
    })
    .join(' ');

  return cssString;
}

export function hostBinding<T, S extends Signal<T> | WritableSignal<T>>(
  hostPropertyName: Required<HostBinding>['hostPropertyName'],
  signal: S,
  options?: {
    element?: HTMLElement,
    injector?: Injector
  }
): S {
  runInInjectionContext(options?.injector ?? inject(Injector), () => {
    const renderer = inject(Renderer2);
    const element = options?.element ?? inject(ElementRef).nativeElement;

    effect(() => {
      const value = signal();
      const [binding, property = '', unit = ''] = hostPropertyName.split('.');
      const isDashCase = property.startsWith('--');

      switch (binding) {
        case 'style':
          if (typeof value === 'object' && value !== null) {
            const styleString = convertStyleObjectToString(value as Record<string, string | number>);
            renderer.setAttribute(element, 'style', styleString);
          } else {
            renderer.setStyle(
              element,
              property,
              `${value}${unit}`,
              isDashCase ? RendererStyleFlags2.DashCase : undefined,
            );
          }
          break;
        case 'attr':
          value == null
            ? renderer.removeAttribute(element, property)
            : renderer.setAttribute(element, property, String(value));
          break;
        case 'class':
          if (property) {
            value ? renderer.addClass(element, property) : renderer.removeClass(element, property);
          } else {
            const classes = (typeof value === 'string' ? value : '').split(' ').filter(Boolean);
            renderer.addClass(element, classes.join(' '));
          }
          break;
        default:
          renderer.setProperty(element, binding, value);
      }
    });
  });

  return signal;
}
