import { Component, input } from '@angular/core';
import { AspectRatioPrimitivesModule } from '../src/aspect-ratio.module';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'vac-aspect-ratio',
  standalone: true,
  imports: [AspectRatioPrimitivesModule, NgStyle],
  template: `
    <div class="w-60 rounded-md overflow-hidden shadow-lg">
      <div
        [vacAspectRatio]="ratio()"
        #aspectRatio="vacAspectRatio"
        class="w-60 rounded-md overflow-hidden shadow-lg"
      >
        <div [ngStyle]="aspectRatio.contentStyle">
          <img
            class="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1592725220707-26006819c3ef?q=80&w=640"
            alt="Roman ruines photography by Luca Tosoni"
          />
        </div>
      </div>
    </div>
  `,
})
export class AspectRatioComponent {
  ratio = input(1);
}
