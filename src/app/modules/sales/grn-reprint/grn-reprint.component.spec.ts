import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnReprintComponent } from './grn-reprint.component';

describe('GrnReprintComponent', () => {
  let component: GrnReprintComponent;
  let fixture: ComponentFixture<GrnReprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnReprintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnReprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
