import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GrnReprintRoutingModule } from './grn-reprint-routing.module';
import { GrnReprintComponent } from './grn-reprint.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { grnService } from 'src/app/services/grn.service';

@NgModule({
  declarations: [
    GrnReprintComponent
  ],
  imports: [
    CommonModule,
    GrnReprintRoutingModule,
    SharedModule
  ],
  providers:[grnService,DatePipe ]
})
export class GrnReprintModule { }
