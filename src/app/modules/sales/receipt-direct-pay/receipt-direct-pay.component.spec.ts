import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptDirectPayComponent } from './receipt-direct-pay.component';

describe('ReceiptDirectPayComponent', () => {
  let component: ReceiptDirectPayComponent;
  let fixture: ComponentFixture<ReceiptDirectPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptDirectPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptDirectPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
