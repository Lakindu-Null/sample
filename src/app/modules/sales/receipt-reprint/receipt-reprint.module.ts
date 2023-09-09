import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReceiptReprintRoutingModule } from './receipt-reprint-routing.module';
import { ReceiptReprintComponent } from './receipt-reprint.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { receiptService } from 'src/app/services/receipt.service';


@NgModule({
  declarations: [
    ReceiptReprintComponent
  ],
  imports: [
    CommonModule,
    ReceiptReprintRoutingModule,SharedModule
  ],providers:[receiptService,DatePipe]
  
})
export class ReceiptReprintModule { }
