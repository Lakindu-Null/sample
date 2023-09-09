import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceReprintComponent } from './invoice-reprint.component';

const routes: Routes = [{ path: '', component: InvoiceReprintComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceReprintRoutingModule { }
