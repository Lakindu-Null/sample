import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptOverPayComponent } from './receipt-over-pay.component';

const routes: Routes = [{ path: '', component: ReceiptOverPayComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptOverPayRoutingModule { }
