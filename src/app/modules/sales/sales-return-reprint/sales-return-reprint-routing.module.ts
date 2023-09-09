import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReturnReprintComponent } from './sales-return-reprint.component';

const routes: Routes = [{ path: '', component: SalesReturnReprintComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesReturnReprintRoutingModule { }
