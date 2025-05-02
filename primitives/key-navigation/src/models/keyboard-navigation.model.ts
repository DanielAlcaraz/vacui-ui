export type RuleCallback = () => void;
export type FocusCallback = ((index: number, element: HTMLElement) => void) | null;

export interface Rule {
  key: string;
  override?: boolean;
  callback: () => void;
}

export type NavigationDirection = 'vertical' | 'horizontal';
