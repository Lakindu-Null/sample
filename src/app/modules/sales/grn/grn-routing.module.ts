import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrnComponent } from './grn.component';

const routes: Routes = [{ path: '', component: GrnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrnRoutingModule { }
