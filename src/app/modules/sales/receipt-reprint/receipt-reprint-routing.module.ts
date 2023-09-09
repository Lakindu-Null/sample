import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptReprintComponent } from './receipt-reprint.component';

const routes: Routes = [{ path: '', component: ReceiptReprintComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptReprintRoutingModule { }
