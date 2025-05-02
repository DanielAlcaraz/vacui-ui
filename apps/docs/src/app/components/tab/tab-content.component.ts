import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-tab-content',
  standalone: true,
  template: `
    <div [class.hidden]="isActive()">
      <ng-content></ng-content>
    </div>
  `
})
export class TabContentComponent {
  label = input.required<string>();
  isActive = model(false);
}
