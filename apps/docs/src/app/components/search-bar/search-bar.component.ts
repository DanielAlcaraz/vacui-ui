import { Component, OnInit, signal, computed, effect } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { create, search as oramaSearch, insert } from '@orama/orama';

interface Doc {
  title: string;
  url: string;
  sectionTitle?: string;
  content: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  highlightedContent?: string;
  highlightedTitle?: string;
  highlightedSectionTitle?: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <input
        type="search"
        [(ngModel)]="searchTerm"
        (ngModelChange)="searchTerm.set($event)"
        class="w-full px-4 py-2 border rounded-md"
        placeholder="Search docs..."
        (keydown)="handleKeyDown($event)"
        (focus)="showModal.set(true)"
      />

      @if (showModal()) {
        <div
          class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            class="w-full max-w-lg p-4 bg-white rounded-lg"
            aria-modal="true"
            role="dialog"
            aria-labelledby="search-modal-title"
            style="height: 400px; overflow-y: auto;"
          >
            <h2 id="search-modal-title" class="text-xl font-bold">Search Results</h2>
            <input
              #modalInput
              type="search"
              [(ngModel)]="searchTerm"
              (ngModelChange)="searchTerm.set($event)"
              class="w-full px-4 py-2 border rounded-md mb-4"
              (keydown)="handleKeyDown($event)"
              autofocus
            />
            <div>
              @for (group of groupedResults(); track group.title) {
                <div class="group-card">
                  <a [href]="group.docs[0].url" class="sub-card">
                    <h3 class="font-bold text-lg" [innerHTML]="group.docs[0].highlightedTitle"></h3>
                  </a>
                  @for (doc of group.docs; track doc.url) {
                    <a [href]="doc.url" class="sub-card">
                      @if (doc.highlightedSectionTitle) {
                        <p class="text-sm" [innerHTML]="doc.highlightedSectionTitle"></p>
                      }
                      <p class="text-sm" [innerHTML]="doc.highlightedContent"></p>
                    </a>
                  }
                </div>
              }
            </div>
            <button
              class="mt-4 px-4 py-2 bg-black text-white font-bold rounded hover:bg-gray-700"
              (click)="handleModalClick()"
            >Close</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .group-card {
      border: 1px solid #ccc;
      margin-bottom: 1rem;
      padding: 1rem;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
    }

    .sub-card {
      border-left: 4px solid royalblue;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      text-decoration: none;
      color: #333;
      transition: background-color 0.3s;
    }

    .sub-card:hover {
      background-color: #f0f0f0;
    }
  `]
})
export class SearchComponent implements OnInit {
  private db: any;
  searchTerm = signal('');
  searchResults = signal<Doc[]>([]);
  groupedResults = computed(() => this.groupResults(this.searchResults()));
  showModal = signal(false);

  ngOnInit() {
    this.initializeDatabase();
    effect(() => this.performSearch());
  }

  async initializeDatabase() {
    const response = await fetch('/docsIndex.json');
    const docs: Doc[] = await response.json();
    this.db = await create({
      schema: {
        title: 'string',
        url: 'string',
        sectionTitle: 'string',
        content: 'string[]',
        tags: 'string[]',
        createdAt: 'string',
        updatedAt: 'string',
      },
    });

    docs.forEach(doc => insert(this.db, doc));
  }

  async performSearch() {
    if (!this.db || this.searchTerm().trim() === '') {
      this.searchResults.set([]);
      return;
    }

    const oramaResults = await oramaSearch(this.db, {
      term: this.searchTerm(),
      properties: ['title', 'content', 'sectionTitle'],
    });

    this.searchResults.set(oramaResults.hits.map(hit => ({
      ...hit.document,
      highlightedTitle: this.highlightText(hit.document.title, this.searchTerm()),
      highlightedSectionTitle: hit.document.sectionTitle ? this.highlightText(hit.document.sectionTitle, this.searchTerm()) : '',
      highlightedContent: this.extractHighlightedContent(hit.document.content, this.searchTerm()),
    })));
  }

  groupResults(results: Doc[]): { title: string; docs: Doc[] }[] {
    const grouped = results.reduce((acc, result) => {
      (acc[result.title] = acc[result.title] || []).push(result);
      return acc;
    }, {} as Record<string, Doc[]>);

    return Object.entries(grouped).map(([title, docs]) => ({ title, docs }));
  }

  highlightText(text: string, term: string): string {
    const sanitizedTerm = this.sanitizeHtml(term);
    const regex = new RegExp(`(${sanitizedTerm})`, 'gi');
    return text.replace(regex, `<span style="background-color:yellow;">$1</span>`);
  }

  extractHighlightedContent(contentArray: string[], term: string): string {
    const termLower = term.toLowerCase();
    let snippet = '';

    for (const paragraph of contentArray) {
      if (paragraph.toLowerCase().includes(termLower) && snippet.length < 150) {
        snippet += paragraph + ' ';
        if (snippet.length > 150) break;
      }
    }

    snippet = snippet.substring(0, Math.min(150, snippet.length));
    return this.highlightText(snippet, term);
  }

  sanitizeHtml(html: string): string {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.showModal.set(false);
    }
  }

  handleModalClick() {
    this.showModal.set(false);
  }
}
