import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPointsComponent } from './product-points.component';

const routes: Routes = [{ path: '', component: ProductPointsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductPointsRoutingModule { }
