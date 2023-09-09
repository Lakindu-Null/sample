import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptCancelComponent } from './receipt-cancel.component';

const routes: Routes = [{ path: '', component: ReceiptCancelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptCancelRoutingModule { }
