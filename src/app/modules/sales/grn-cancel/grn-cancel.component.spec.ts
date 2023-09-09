import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnCancelComponent } from './grn-cancel.component';

describe('GrnCancelComponent', () => {
  let component: GrnCancelComponent;
  let fixture: ComponentFixture<GrnCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
