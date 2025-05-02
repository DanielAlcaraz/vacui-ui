import { NgClass } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { codeToHtml } from 'shiki';
import { ShikiHighlighterService } from '../../services/shiki-highlighter.service';

@Component({
  selector: 'docs-code',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="rounded-lg overflow-hidden relative font-mono border border-slate-200 shadow-sm dark:border-slate-700 w-full"
      [ngClass]="{ 'pt-8': filename() }"
    >
      @if (filename()) {
        <div
          class="absolute top-0 left-0 right-0 px-4 py-1.5 text-sm text-slate-500 bg-slate-100 border-b border-slate-200 flex items-center justify-between dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
        >
          <span>{{ filename() }}</span>
          <button
            class="bg-transparent border-none text-slate-500 cursor-pointer px-2 py-0.5 rounded text-xs flex items-center gap-1 transition-colors dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            (click)="copyToClipboard()"
          >
            @if (!copied()) {
              <svg
                class="w-3.5 h-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                ></path>
              </svg>
            } @else {
              <svg
                class="w-3.5 h-3.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            }
            {{ copied() ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      }

      @if (loading()) {
        <div
          class="p-4 text-slate-500 italic bg-slate-50 dark:bg-slate-900 dark:text-slate-400"
        >
          Loading syntax highlighter...
        </div>
      } @else {
        <div
          class="w-full overflow-x-auto"
          [ngClass]="isDark() ? 'bg-slate-900' : 'bg-slate-50'"
        >
          <div class="flex">
            <!-- Line numbers column -->
            @if (showLineNumbers()) {
              <div
                class="flex-none w-12 text-right pr-4 select-none border-r border-slate-200 dark:border-slate-700 pt-3 pb-3"
                style="line-height: 1.5;"
              >
                @for (num of lineNumbers(); track num) {
                  <div
                    class="text-slate-400 dark:text-slate-600 text-xs"
                    style="height: 1.5rem;"
                  >
                    {{ num }}
                  </div>
                }
              </div>
            }

            <!-- Code content -->
            <div class="flex-grow">
              <pre
                [ngClass]="{
                  'pl-4': showLineNumbers(),
                  'px-4': !showLineNumbers()
                }"
                class="m-0 pt-3 pb-3 language-{{ language() }} {{ customClasses() }}"
                style="line-height: 1.5;"
              ><code [innerHTML]="highlightedCode()"></code></pre>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    ::ng-deep .shiki {
      background-color: transparent !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    ::ng-deep .shiki code {
      font-size: 14px !important;
      line-height: 1.5 !important;
      background-color: transparent !important;
    }
    
    ::ng-deep .shiki span {
      line-height: 1.5 !important;
    }
    
    pre {
      margin: 0 !important;
      overflow: visible !important;
      background-color: transparent !important;
    }
    
    code {
      white-space: pre !important;
      word-break: normal !important;
      word-wrap: normal !important;
      font-family: inherit !important;
    }
    
    ::ng-deep div[style="display: block; height: 1.5rem"] {
      white-space: pre !important;
    }
  `]
})
export class CodeHighlightComponent {
  // Input parameters
  // Use a transform on the code input to trim extra newlines at beginning and end
  code = input.required({
    transform: (value: string) => value.replace(/^\n+|\n+$/g, '')
  });
  language = input<string>('text');
  theme = input<string>('github-dark');
  filename = input<string | null>(null);
  customClasses = input<string>('');
  highlightLines = input<string>(''); // Format: "1,3-5" to highlight lines 1, 3, 4, 5
  showLineNumbers = input<boolean>(false);
  isDark = input<boolean>(true);

  // Service injection
  private sanitizer = inject(DomSanitizer);
  private highlighterService = inject(ShikiHighlighterService);

  // State
  highlightedCode = signal<SafeHtml>('');
  copied = signal<boolean>(false);
  loading = signal<boolean>(true);

  // Computed values
  linesToHighlight = computed<Set<number>>(() => {
    const result = new Set<number>();
    const lineInfo = this.highlightLines();

    if (!lineInfo) return result;

    lineInfo.split(',').forEach((part) => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
        for (let i = start; i <= end; i++) {
          result.add(i);
        }
      } else {
        const lineNum = parseInt(part.trim(), 10);
        if (!isNaN(lineNum)) {
          result.add(lineNum);
        }
      }
    });

    return result;
  });

  // Computed value for line numbers array - Fixed to preserve whitespace
  lineNumbers = computed<number[]>(() => {
    const lines = this.code().split('\n');
    return Array.from({ length: lines.length }, (_, i) => i + 1);
  });

  constructor() {
    afterNextRender(() => {
      this.highlightCode();
    });
  }

  async highlightCode() {
    try {
      const theme = this.theme();
      const lang = this.language();

      // Check if theme and language are available in bundled options
      if (
        !this.highlighterService.isThemeAvailable(theme) ||
        !this.highlighterService.isLanguageAvailable(lang)
      ) {
        console.warn(
          `Theme "${theme}" or language "${lang}" not available in bundled options. Falling back to codeToHtml.`
        );
        // Use codeToHtml shorthand for one-time highlighting instead
        // This will auto-load the theme and language
        const html = await codeToHtml(this.code(), { lang, theme });

        // Process the HTML to add line highlighting
        const processedHtml = this.processHtml(html);

        // Sanitize the HTML to prevent XSS attacks
        this.highlightedCode.set(
          this.sanitizer.bypassSecurityTrustHtml(processedHtml)
        );
        this.loading.set(false);
        return;
      }

      // Get the highlighter instance with required theme and language
      const highlighter = await this.highlighterService.getHighlighter(
        [theme],
        [lang]
      );

      // Highlight the code
      const html = highlighter.codeToHtml(this.code(), {
        lang,
        theme,
      });

      // Process the HTML to add line highlighting
      const processedHtml = this.processHtml(html);

      // Sanitize the HTML to prevent XSS attacks
      this.highlightedCode.set(
        this.sanitizer.bypassSecurityTrustHtml(processedHtml)
      );
      this.loading.set(false);
    } catch (error) {
      console.error('Error highlighting code:', error);
      // Fall back to plain text if highlighting fails
      this.highlightedCode.set(
        this.sanitizer.bypassSecurityTrustHtml(
          `<pre>${this.escapeHtml(this.code())}</pre>`
        )
      );
      this.loading.set(false);
    }
  }

  private processHtml(html: string): string {
    // If no line highlighting needed, return the original HTML
    if (this.linesToHighlight().size === 0) {
      return html;
    }
    
    // Extract the root pre tag
    const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
    if (!preMatch) return html;
    
    const preContent = preMatch[1];
    const codeMatch = preContent.match(/<code[^>]*>([\s\S]*?)<\/code>/);
    if (!codeMatch) return html;
    
    // Split the content into lines while preserving the HTML tags
    const codeContent = codeMatch[1];
    const lines = codeContent.split('\n');
    
    // Wrap each line with highlighting if needed
    const processedLines = lines.map((line, index) => {
      if (this.linesToHighlight().has(index + 1)) {
        return `<div class="bg-blue-50 dark:bg-blue-900/20 -mx-4 px-4" style="display: block; height: 1.5rem; white-space: pre;">${line}</div>`;
      }
      return `<div style="display: block; height: 1.5rem; white-space: pre;">${line}</div>`;
    });
    
    // Reconstruct the HTML
    const processedCode = processedLines.join('\n');
    const processedContent = preContent.replace(codeContent, processedCode);
    
    return html.replace(preContent, processedContent);
  }

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.code())
      .then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}