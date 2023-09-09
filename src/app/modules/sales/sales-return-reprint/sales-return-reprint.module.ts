import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SalesReturnReprintRoutingModule } from './sales-return-reprint-routing.module';
import { SalesReturnReprintComponent } from './sales-return-reprint.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { salesreturnService } from 'src/app/services/salesreturn.service';


@NgModule({
  declarations: [
    SalesReturnReprintComponent
  ],
  imports: [
    CommonModule,
    SalesReturnReprintRoutingModule,
    SharedModule
  ],providers:[salesreturnService,DatePipe]
})
export class SalesReturnReprintModule { }
