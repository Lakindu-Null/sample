import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommisionComponent } from './commision.component';

const routes: Routes = [{ path: '', component: CommisionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommisionRoutingModule { }
