import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptOverPayRoutingModule } from './receipt-over-pay-routing.module';
import { ReceiptOverPayComponent } from './receipt-over-pay.component';


@NgModule({
  declarations: [
    ReceiptOverPayComponent
  ],
  imports: [
    CommonModule,
    ReceiptOverPayRoutingModule
  ]
})
export class ReceiptOverPayModule { }
