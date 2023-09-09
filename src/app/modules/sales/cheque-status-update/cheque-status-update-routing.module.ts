import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChequeStatusUpdateComponent } from './cheque-status-update.component';

const routes: Routes = [{ path: '', component: ChequeStatusUpdateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChequeStatusUpdateRoutingModule { }
