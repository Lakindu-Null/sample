import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessPolicyComponent } from './user-access-policy.component';

describe('UserAccessPolicyComponent', () => {
  let component: UserAccessPolicyComponent;
  let fixture: ComponentFixture<UserAccessPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccessPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccessPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
