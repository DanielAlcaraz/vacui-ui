import { Directive, inject } from "@angular/core";
import { SwitchRootDirective } from "./switch-root.directive";
import { hostBinding } from "@vacui-ui/primitives/utils";

@Directive({
  selector: '[vacSwitchThumb]',
  standalone: true,
  exportAs: 'vacSwitchThumb'
})
export class SwitchThumbDirective {
  private root = inject(SwitchRootDirective);

  constructor() {
    hostBinding('attr.data-state', this.root.dataState);
    hostBinding('attr.data-disabled', this.root.dataDisabled);
  }
}
