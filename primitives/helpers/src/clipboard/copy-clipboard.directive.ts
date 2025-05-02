import { Directive, HostListener, Input } from '@angular/core';

export interface ClipboardCopyItem {
  mimeType: string;
  data: string | (() => Promise<string> | string);
}

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  @Input('appCopyToClipboard') copyItems: ClipboardCopyItem[] = [];

  constructor() {}

  @HostListener('click', ['$event'])
  async onCopy(event: MouseEvent) {
    event.preventDefault();
    if (navigator.clipboard) {
      for (const item of this.copyItems) {
        const data = typeof item.data === 'function' ? await item.data() : item.data;
        navigator.clipboard.writeText(data).then(
          () => console.log('Content copied to clipboard!'),
          (err) => console.error('Failed to copy content: ', err)
        );
      }
    }
  }
}
