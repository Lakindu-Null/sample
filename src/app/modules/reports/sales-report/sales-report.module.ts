import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SalesReportRoutingModule } from './sales-report-routing.module';
import { SalesReportComponent } from './sales-report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsService } from 'src/app/services/reports.service';


@NgModule({
  declarations: [
    SalesReportComponent
  ],
  imports: [
    CommonModule,
    SalesReportRoutingModule,
    SharedModule
  ],providers:[ReportsService,DatePipe]
})
export class SalesReportModule { }
