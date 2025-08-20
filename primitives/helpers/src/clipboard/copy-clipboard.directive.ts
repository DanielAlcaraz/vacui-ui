import { Directive, HostListener, input } from '@angular/core';

export interface ClipboardCopyItem {
  mimeType: string;
  data: string | (() => Promise<string> | string);
}

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  readonly copyItems = input<ClipboardCopyItem[]>([], { alias: "appCopyToClipboard" });

  constructor() {}

  @HostListener('click', ['$event'])
  async onCopy(event: MouseEvent) {
    event.preventDefault();
    if (navigator.clipboard) {
      for (const item of this.copyItems()) {
        const data = typeof item.data === 'function' ? await item.data() : item.data;
        navigator.clipboard.writeText(data).then(
          () => console.log('Content copied to clipboard!'),
          (err) => console.error('Failed to copy content: ', err)
        );
      }
    }
  }
}
