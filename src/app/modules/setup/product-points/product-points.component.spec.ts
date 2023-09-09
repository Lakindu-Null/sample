import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPointsComponent } from './product-points.component';

describe('ProductPointsComponent', () => {
  let component: ProductPointsComponent;
  let fixture: ComponentFixture<ProductPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPointsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
