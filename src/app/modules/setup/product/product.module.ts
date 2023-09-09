import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { productService } from 'src/app/services/product.service';


@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule
  ],
  providers:[productService]
})
export class ProductModule { }
