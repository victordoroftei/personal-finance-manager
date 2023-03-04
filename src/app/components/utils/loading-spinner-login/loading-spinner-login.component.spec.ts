import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerLoginComponent } from './loading-spinner-login.component';

describe('LoadingSpinnerLoginComponent', () => {
  let component: LoadingSpinnerLoginComponent;
  let fixture: ComponentFixture<LoadingSpinnerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingSpinnerLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
