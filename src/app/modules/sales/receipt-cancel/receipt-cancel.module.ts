import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptCancelRoutingModule } from './receipt-cancel-routing.module';
import { ReceiptCancelComponent } from './receipt-cancel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { receiptService } from 'src/app/services/receipt.service';


@NgModule({
  declarations: [
    ReceiptCancelComponent
  ],
  imports: [
    CommonModule,
    ReceiptCancelRoutingModule,
    SharedModule
  ],
  providers: [receiptService]
})
export class ReceiptCancelModule { }
