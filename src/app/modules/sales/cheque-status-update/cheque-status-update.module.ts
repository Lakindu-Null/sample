import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChequeStatusUpdateRoutingModule } from './cheque-status-update-routing.module';
import { ChequeStatusUpdateComponent } from './cheque-status-update.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { receiptService } from 'src/app/services/receipt.service';

@NgModule({
  declarations: [
    ChequeStatusUpdateComponent
  ],
  imports: [
    CommonModule,
    ChequeStatusUpdateRoutingModule,
    SharedModule
  ],providers:[receiptService,DatePipe]
})
export class ChequeStatusUpdateModule { }
