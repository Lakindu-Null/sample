import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptDirectPayComponent } from './receipt-direct-pay.component';

const routes: Routes = [{ path: '', component: ReceiptDirectPayComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptDirectPayRoutingModule { }
