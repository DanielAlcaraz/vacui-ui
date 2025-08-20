import { MarkdownComponent, injectContent } from '@analogjs/content';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PageAttributes } from '../../models/doc-page-attributes';

@Component({
  selector: 'docs-directives',
  standalone: true,
  imports: [MarkdownComponent],
  template: `
    @if (page()?.content) {
    <div class="text-left">
      <h1>{{ page()?.attributes?.title }}</h1>
      <analog-markdown [content]="page()?.content"></analog-markdown>
    </div>
    }
  `
})
export default class DocsContentDirectivesComponent {
  route = inject(ActivatedRoute);
  page$ = injectContent<PageAttributes>({
    param: 'slug',
    subdirectory: 'docs/directives',
  });
  page = toSignal(this.page$);
}
