import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { InvoiceReprintRoutingModule } from './invoice-reprint-routing.module';
import { InvoiceReprintComponent } from './invoice-reprint.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { invoiceService } from 'src/app/services/invoice.service';


@NgModule({
  declarations: [
    InvoiceReprintComponent
  ],
  imports: [
    CommonModule,
    InvoiceReprintRoutingModule,
    SharedModule
  ],providers:[invoiceService,DatePipe]
})
export class InvoiceReprintModule { }
