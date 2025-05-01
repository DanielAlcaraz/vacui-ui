import { Component } from '@angular/core';
import { DocLayoutComponent } from '../layouts/DocsLayout.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'docs-docs',
  standalone: true,
  imports: [RouterOutlet, DocLayoutComponent],
  template: `
  <div>
    <docs-layout>
      <router-outlet></router-outlet>
    </docs-layout>
  </div>
  `,
})
export default class DocsComponent {}
