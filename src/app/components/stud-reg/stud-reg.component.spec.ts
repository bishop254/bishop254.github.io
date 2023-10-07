import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudRegComponent } from './stud-reg.component';

describe('StudRegComponent', () => {
  let component: StudRegComponent;
  let fixture: ComponentFixture<StudRegComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudRegComponent]
    });
    fixture = TestBed.createComponent(StudRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
