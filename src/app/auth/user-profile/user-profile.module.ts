import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Authenticatorservice } from '../services/authentication.service';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    SharedModule,
    ToastModule
  ],providers:[Authenticatorservice]
})
export class UserProfileModule { }
