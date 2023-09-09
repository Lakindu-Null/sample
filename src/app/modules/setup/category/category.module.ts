import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryService } from 'src/app/services/category.service';


@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule
  ],
  providers: [CategoryService]
})
export class CategoryModule { }
