import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAccessPolicyRoutingModule } from './user-access-policy-routing.module';
import { UserAccessPolicyComponent } from './user-access-policy.component';


@NgModule({
  declarations: [
    UserAccessPolicyComponent
  ],
  imports: [
    CommonModule,
    UserAccessPolicyRoutingModule
  ]
})
export class UserAccessPolicyModule { }
