import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrnRoutingModule } from './grn-routing.module';
import { GrnComponent } from './grn.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { grnService } from 'src/app/services/grn.service';


@NgModule({
  declarations: [
    GrnComponent
  ],
  imports: [
    CommonModule,
    GrnRoutingModule,SharedModule
  ],providers:[
    grnService
  ]
})
export class GrnModule { }
