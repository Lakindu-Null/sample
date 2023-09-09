import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeStatusUpdateComponent } from './cheque-status-update.component';

describe('ChequeStatusUpdateComponent', () => {
  let component: ChequeStatusUpdateComponent;
  let fixture: ComponentFixture<ChequeStatusUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeStatusUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
