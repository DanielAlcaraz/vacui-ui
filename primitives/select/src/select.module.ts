import { NgModule } from '@angular/core';
import { SelectContentDirective } from './directives/select-content.directive';
import { SelectGroupDirective } from './directives/select-group.directive';
import { SelectItemIndicatorDirective } from './directives/select-item-indicator.directive';
import { SelectItemTextDirective } from './directives/select-item-text.directive';
import { SelectItemDirective } from './directives/select-item.directive';
import { SelectGroupLabelDirective } from './directives/select-group-label.directive';
import { SelectRootDirective } from './directives/select-root.directive';
import { SelectSeparatorDirective } from './directives/select-separator.directive';
import { SelectTriggerDirective } from './directives/select-trigger.directive';
import { SelectValueDirective } from './directives/select-value.directive';
import { SelectViewportDirective } from './directives/select-viewport.directive';
import { SelectVisibilityDirective } from './directives/select-visibility.directive';

// TODO: Create arrow directives. Control viewport height. I think right now it grows as long as it has items.
const directives = [
  SelectRootDirective,
  SelectContentDirective,
  SelectGroupDirective,
  SelectItemIndicatorDirective,
  SelectItemTextDirective,
  SelectItemDirective,
  SelectGroupLabelDirective,
  SelectSeparatorDirective,
  SelectTriggerDirective,
  SelectValueDirective,
  SelectViewportDirective,
  SelectVisibilityDirective
];

@NgModule({
  imports: [...directives],
  exports: [...directives],
})
export class SelectPrimitivesModule {}
