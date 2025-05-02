import { NgModule } from '@angular/core';
import { AvatarRootDirective } from './directives/avatar-root.directive';
import { AvatarImageDirective } from './directives/avatar-image.directive';
import { AvatarFallbackDirective } from './directives/avatar-fallback.directive';

@NgModule({
  imports: [
    AvatarRootDirective,
    AvatarImageDirective,
    AvatarFallbackDirective,
  ],
  exports: [AvatarRootDirective, AvatarImageDirective, AvatarFallbackDirective],
})
export class AvatarPrimitivesModule {}
