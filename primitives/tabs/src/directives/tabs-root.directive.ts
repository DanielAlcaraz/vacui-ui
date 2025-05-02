import { Directive, inject, input, output } from '@angular/core';
import { connectSignals, hostBinding } from '@vacui-kit/primitives/utils';
import { Orientation } from '../models/tabs.model';
import { TabsStateService } from '../state/tabs-state.service';

@Directive({
  selector: '[vacTabsRoot]',
  providers: [TabsStateService],
  exportAs: 'vacTabsRoot',
  standalone: true,
  inputs: ['orientation', 'automatic'],
})
export class TabsRootDirective {
  state = inject(TabsStateService);
  value = input<string | null>(this.state.value());

  set orientation(orientation: Orientation) {
    this.state.orientation.set(orientation);
  }
  set automatic(automatic: boolean) {
    this.state.automatic.set(automatic);
  }

  valueChange = output<string | null>();

  constructor() {
    connectSignals(this.value, this.state.value, this.valueChange);
    hostBinding('attr.data-orientation', this.state.orientation);
  }
}
