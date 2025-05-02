import { MarkdownComponent, injectContent, injectContentFiles } from '@analogjs/content';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PageAttributes } from '../../models/doc-page-attributes';

@Component({
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
export default class DocsContentOverviewComponent {
  route = inject(ActivatedRoute);
  posts = injectContentFiles<PageAttributes>();
  page$ = injectContent<PageAttributes>({
    param: 'slug',
    subdirectory: 'docs/overview',
  });
  page = toSignal(this.page$);
}
