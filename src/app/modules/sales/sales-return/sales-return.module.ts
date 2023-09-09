import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SalesReturnRoutingModule } from './sales-return-routing.module';
import { SalesReturnComponent } from './sales-return.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { salesreturnService } from 'src/app/services/salesreturn.service';
import { invoiceService } from 'src/app/services/invoice.service';

@NgModule({
  declarations: [
    SalesReturnComponent
  ],
  imports: [
    CommonModule,
    SalesReturnRoutingModule,
    SharedModule
  ],providers:[salesreturnService,invoiceService, DatePipe]
})
export class SalesReturnModule { }
