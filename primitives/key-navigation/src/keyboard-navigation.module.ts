import { NgModule } from '@angular/core';
import { KeyNavigationRootDirective, KeyNavigationItemDirective } from '../public-api';

@NgModule({
  imports: [KeyNavigationRootDirective, KeyNavigationItemDirective],
  exports: [KeyNavigationRootDirective, KeyNavigationItemDirective],
})
export class KeyNavigationModule {}
