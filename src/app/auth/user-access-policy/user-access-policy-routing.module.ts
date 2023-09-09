import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccessPolicyComponent } from './user-access-policy.component';

const routes: Routes = [{ path: '', component: UserAccessPolicyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAccessPolicyRoutingModule { }
