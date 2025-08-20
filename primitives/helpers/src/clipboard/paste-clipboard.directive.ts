import { Directive, HostListener, inject, output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface PasteData {
  type: string;
  value: string | SafeHtml | ArrayBuffer | null; // Accommodate various data types
}

@Directive({
  selector: '[appPasteFromClipboard]'
})
export class PasteFromClipboardDirective {
  private sanitizer = inject(DomSanitizer);

  readonly pasteData = output<PasteData[]>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    if (!event.clipboardData) return;

    const items: PasteData[] = [];
    const dataTransferItems = event.clipboardData.items;

    // Use classic loop for compatibility with TypeScript's type checking
    for (let i = 0; i < dataTransferItems.length; i++) {
      const item = dataTransferItems[i];
      if (item.kind === 'string') {
        item.getAsString((data: string) => {
          let sanitizedData: string | SafeHtml = data;
          if (item.type === 'text/html') {
            sanitizedData = this.sanitizer.bypassSecurityTrustHtml(data); // Trust HTML content
          } else if (item.type === 'text/plain' || item.type === 'text/markdown') {
            sanitizedData = this.sanitizer.sanitize(1, data) || ''; // Sanitize plain text or Markdown
          }
          items.push({ type: item.type, value: sanitizedData });
          this.pasteData.emit(items); // Emit once all string processing is done
        });
      } else if (item.kind === 'file' && item.getAsFile()) {
        const file = item.getAsFile()!;
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const fileContent = e.target?.result ?? null;
          items.push({ type: file.type, value: fileContent });
          this.pasteData.emit(items); // Emit inside FileReader's async operation
        };

        // Read file content based on type
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file); // Images as Data URLs for displaying
        } else {
          reader.readAsText(file); // Other files as text for simplicity
        }
      }
    }
  }
}
