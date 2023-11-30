import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewApplComponent } from './preview-appl.component';

describe('PreviewApplComponent', () => {
  let component: PreviewApplComponent;
  let fixture: ComponentFixture<PreviewApplComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewApplComponent]
    });
    fixture = TestBed.createComponent(PreviewApplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
