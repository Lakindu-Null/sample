import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPointsRoutingModule } from './product-points-routing.module';
import { ProductPointsComponent } from './product-points.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { productService } from 'src/app/services/product.service';

@NgModule({
  declarations: [
    ProductPointsComponent
  ],
  imports: [
    CommonModule,
    ProductPointsRoutingModule,
    SharedModule
  ],providers:[productService]
})
export class ProductPointsModule { }
