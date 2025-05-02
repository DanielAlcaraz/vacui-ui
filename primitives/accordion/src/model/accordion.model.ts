export type AccordionOrientation = 'horizontal' | 'vertical';
export type AccordionState = 'open' | 'closed';
export type AccordionValue = string | string[] | null;

export interface AccordionItem {
  id: string;
  value: string;
  disabled: boolean;
  state: AccordionState;
}

export interface AccordionConfig {
  multiple: boolean;
  collapsible: boolean;
  disabled: boolean;
  value: string | string[] | null;
  orientation: AccordionOrientation;
}
