import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentStockRoutingModule } from './current-stock-routing.module';
import { CurrentStockComponent } from './current-stock.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { stockService } from 'src/app/services/stock.service';

@NgModule({
  declarations: [
    CurrentStockComponent
  ],
  imports: [
    CommonModule,
    CurrentStockRoutingModule,
    SharedModule
  ],providers:[stockService]
})
export class CurrentStockModule { }
