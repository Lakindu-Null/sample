import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrnCancelRoutingModule } from './grn-cancel-routing.module';
import { GrnCancelComponent } from './grn-cancel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { grnService } from 'src/app/services/grn.service';


@NgModule({
  declarations: [
    GrnCancelComponent
  ],
  imports: [
    CommonModule,
    GrnCancelRoutingModule,
    SharedModule
  ],providers:[grnService]
})
export class GrnCancelModule { }
