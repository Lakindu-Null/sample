import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrnReprintComponent } from './grn-reprint.component';

const routes: Routes = [{ path: '', component: GrnReprintComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrnReprintRoutingModule { }
