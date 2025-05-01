import { ElementRef } from "@angular/core";

export type Orientation = 'vertical' | 'horizontal';
export type Direction = 'ltr' | 'rtl';
export type ActivationMode = 'automatic' | 'manual';
export type ActivationState = 'active' | 'inactive';

export interface Tab {
  id: string;
  elementRef: ElementRef;
  disabled: boolean;
}
