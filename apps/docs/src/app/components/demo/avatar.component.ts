import { Component } from '@angular/core';
import { AvatarRootDirective, AvatarImageDirective, AvatarFallbackDirective } from '@vacui-ui/primitives/avatar';

@Component({
  selector: 'vac-avatar',
  standalone: true,
  imports: [AvatarRootDirective, AvatarImageDirective, AvatarFallbackDirective],
  template: `
    <div class="not-prose flex justify-center space-x-4 p-4">
      <!-- Successful loading of an image -->
      <div
        vacAvatarRoot
          class="relative flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full shadow-lg overflow-hidden"
      >
        <img
          vacAvatarImage
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
          alt="Wikipedia"
          class="w-full h-full object-cover rounded-full"
        />
        <div
          *vacAvatarFallback="0"
          class="absolute inset-0 bg-orange-200 text-orange-700 flex items-center justify-center text-lg font-bold rounded-full"
        >
          WP
        </div>
      </div>

      <!-- Successful loading of an image with delayMs -->
      <div
        vacAvatarRoot
        class="relative flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full shadow-lg overflow-hidden"
      >
        <img
          vacAvatarImage
          src="https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=200&q=60"
          alt="Wikipedia"
          class="w-full h-full object-cover rounded-full"
          (loadingStatusChange)="onLoadingStatusChange($event)"
        />
        <div
          *vacAvatarFallback="1000"
          class="absolute inset-0 bg-orange-200 text-orange-700 flex items-center justify-center text-lg font-bold rounded-full"
        >
          WP
        </div>
      </div>

      <!-- I'm trying to load an image but it gives error -->
      <div
        vacAvatarRoot
        class="relative flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full shadow-lg overflow-hidden"
      >
        <img
          vacAvatarImage
          src="https://invalidurl.invalid"
          alt="Invalid"
          class="w-full h-full object-cover rounded-full"
        />
        <div
          *vacAvatarFallback="1500"
          class="absolute inset-0 bg-orange-200 text-orange-700 flex items-center justify-center text-lg font-bold rounded-full"
        >
          IV
        </div>
      </div>

      <!-- Image source is not provided and initials are shown -->
      <div
        vacAvatarRoot
        class="relative flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full shadow-lg overflow-hidden"
      >
        <div
          *vacAvatarFallback
          class="absolute inset-0 bg-orange-200 text-orange-700 flex items-center justify-center text-lg font-bold rounded-full"
        >
          EM
        </div>
      </div>
    </div>
  `,
})
export class AvatarComponent {
  onLoadingStatusChange(status: string) {
    console.log(status);
  }
}
