// label-root.directive.spec.ts
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LabelRootDirective } from './label.directive';
import { screen } from '@testing-library/angular';
import { axe } from 'jest-axe';

@Component({
  template: `<label vacLabelRoot>LABEL</label>`,
  standalone: true,
  imports: [LabelRootDirective]
})
class TestComponent {}

describe('LabelRootDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let labelEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    labelEl = fixture.debugElement.query(By.directive(LabelRootDirective)).nativeElement;
  });

  it('should create an instance', async () => {
    const directive = new LabelRootDirective();
    expect(directive).toBeTruthy();
    expect(await axe(screen.queryByText('LABEL')!)).toHaveNoViolations();
  });

  it('should prevent default on double mousedown', () => {
    const event = new MouseEvent('mousedown', { detail: 2 });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    labelEl.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not prevent default on single mousedown', () => {
    const event = new MouseEvent('mousedown', { detail: 1 });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    labelEl.dispatchEvent(event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
