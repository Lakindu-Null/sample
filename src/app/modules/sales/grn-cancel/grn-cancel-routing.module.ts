import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrnCancelComponent } from './grn-cancel.component';

const routes: Routes = [{ path: '', component: GrnCancelComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrnCancelRoutingModule { }
