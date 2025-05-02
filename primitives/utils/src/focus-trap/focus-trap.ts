export class FocusTrap {
  private static traps: FocusTrap[] = [];
  private static activeTraps: FocusTrap[] = [];
  private focusableElements!: HTMLElement[];
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private handleKeyDown!: (event: KeyboardEvent) => void;
  private document: Document;

  constructor(
    element: HTMLElement,
    private options: {
      autoFocus?: boolean;
      document?: Document;
    } = {}
  ) {
    // To do not break during SSR
    this.document =
      this.options.document ||
      (typeof document !== 'undefined' ? document : ({} as Document));

    if (typeof window === 'undefined') return;

    this.focusableElements = this.getFocusableElements(element);
    if (this.focusableElements.length > 0) {
      this.firstFocusableElement = this.focusableElements[0];
      this.lastFocusableElement =
        this.focusableElements[this.focusableElements.length - 1];
    }
    this.handleKeyDown = this.handleKeyDownEvent.bind(this);
    this.activate();

    if (this.options.autoFocus && this.firstFocusableElement) {
      this.focusFirst();
    }
  }

  public static create(
    element: HTMLElement,
    options?: {
      autoFocus?: boolean;
      document?: Document;
    }
  ): FocusTrap {
    const trap = new FocusTrap(element, options);
    FocusTrap.traps.push(trap);
    return trap;
  }

  public focusFirst(): void {
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
  }

  public remove(): void {
    this.deactivate();
    FocusTrap.activeTraps = FocusTrap.activeTraps.filter(
      (trap) => trap !== this
    );
    FocusTrap.traps = FocusTrap.traps.filter((trap) => trap !== this);

    if (FocusTrap.traps.length) {
      FocusTrap.traps[FocusTrap.traps.length - 1].activate();
    }
  }

  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
    ];
    const elements = container.querySelectorAll(focusableSelectors.join(','));
    return Array.from(elements) as HTMLElement[];
  }

  private handleKeyDownEvent(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      if (this.focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const { activeElement } = this.document;
      if (event.shiftKey) {
        // Shift + Tab
        if (activeElement === this.firstFocusableElement) {
          event.preventDefault();
          this.lastFocusableElement?.focus();
        }
      } else {
        // Tab
        if (activeElement === this.lastFocusableElement) {
          event.preventDefault();
          this.firstFocusableElement?.focus();
        }
      }
    }
  }

  private activate(): void {
    FocusTrap.deactivateCurrentTrap();
    this.document.addEventListener('keydown', this.handleKeyDown);
    FocusTrap.activeTraps.push(this);
  }

  private deactivate(): void {
    this.document.removeEventListener('keydown', this.handleKeyDown);
  }

  private static deactivateCurrentTrap(): void {
    if (typeof window === 'undefined') return;

    const currentTrap = FocusTrap.activeTraps.pop();
    if (currentTrap) {
      currentTrap.deactivate();
    }
  }
}
