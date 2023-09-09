import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReturnComponent } from './sales-return.component';

const routes: Routes = [{ path: '', component: SalesReturnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesReturnRoutingModule { }
