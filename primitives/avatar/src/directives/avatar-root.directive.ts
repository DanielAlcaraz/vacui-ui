import { Directive } from '@angular/core';
import { AvatarStateService } from '../state/avatar.service';

@Directive({
  selector: '[vacAvatarRoot]',
  providers: [AvatarStateService],
  standalone: true,
  exportAs: 'vacAvatarRoot'
})
export class AvatarRootDirective {}
