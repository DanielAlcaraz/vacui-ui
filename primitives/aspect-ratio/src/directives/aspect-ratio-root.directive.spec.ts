import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Renderer2 } from '@angular/core';
import { AspectRatioRootDirective } from './aspect-ratio-root.directive';
import { NgStyle } from '@angular/common';

@Component({
  template: `
    <div
      [vacAspectRatio]="ratio"
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
  `,
  standalone: true,
  imports: [AspectRatioRootDirective, NgStyle],
})
class TestComponent {
  ratio = 1.5;
}

describe('AspectRatioRootDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AspectRatioRootDirective, TestComponent],
      providers: [Renderer2],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should apply correct aspect ratio padding', () => {
    const divElement: HTMLElement = element.querySelector('div')!;
    const paddingBottomPercentage = parseFloat(divElement.style.paddingBottom);
    // The '4' indicates precision (number of digits after the decimal point)
    expect(paddingBottomPercentage).toBeCloseTo(66.6667, 4); // For a 1.5 aspect ratio
  });

  it('should correctly create and style inner and wrapper div elements', () => {
    const wrapperDiv: HTMLElement = element.querySelector('div')!;
    expect(wrapperDiv.style.position).toBe('relative');
    expect(wrapperDiv.style.width).toBe('100%');

    const innerDiv: HTMLElement = wrapperDiv.querySelector('div')!;
    expect(innerDiv.style.position).toBe('absolute');
    expect(innerDiv.style.top).toBe('0px');
    expect(innerDiv.style.right).toBe('0px');
    expect(innerDiv.style.bottom).toBe('0px');
    expect(innerDiv.style.left).toBe('0px');
  });

  it('should recalculate padding when aspect ratio changes', () => {
    let divElement: HTMLElement = element.querySelector('div')!;
    let paddingBottomPercentage = parseFloat(divElement.style.paddingBottom);
    expect(paddingBottomPercentage).toBeCloseTo(66.6667, 4); // For the initial 1.5 aspect ratio

    component.ratio = 2;
    fixture.detectChanges();

    divElement = element.querySelector('div')!;
    paddingBottomPercentage = parseFloat(divElement.style.paddingBottom);
    expect(paddingBottomPercentage).toBeCloseTo(50, 4);
  });
});
