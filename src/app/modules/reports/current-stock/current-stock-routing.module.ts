import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrentStockComponent } from './current-stock.component';

const routes: Routes = [{ path: '', component: CurrentStockComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrentStockRoutingModule { }
