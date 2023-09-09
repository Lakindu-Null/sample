import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptOverPayComponent } from './receipt-over-pay.component';

describe('ReceiptOverPayComponent', () => {
  let component: ReceiptOverPayComponent;
  let fixture: ComponentFixture<ReceiptOverPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptOverPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptOverPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
