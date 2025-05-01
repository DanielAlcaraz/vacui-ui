export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipListener {
  activate: (element: HTMLElement) => void;
  deactivate: () => void;
}
