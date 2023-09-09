import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReceiptDirectPayRoutingModule } from './receipt-direct-pay-routing.module';
import { ReceiptDirectPayComponent } from './receipt-direct-pay.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { receiptService } from 'src/app/services/receipt.service';


@NgModule({
  declarations: [
    ReceiptDirectPayComponent
  ],
  imports: [
    CommonModule,
    ReceiptDirectPayRoutingModule,
    SharedModule
  ],
  providers:[receiptService, DatePipe]
})
export class ReceiptDirectPayModule { }
