import { Injectable } from "@angular/core";
import { mutable } from "@vacui-kit/primitives/utils";
import { ToggleGroupItemDirective } from "../directives/toggle-group-item.directive";

@Injectable()
export class ToggleGroupStateService {
  items = mutable<ToggleGroupItemDirective[]>([]);
}