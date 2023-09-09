import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CommisionRoutingModule } from './commision-routing.module';
import { CommisionComponent } from './commision.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportsService } from 'src/app/services/reports.service';


@NgModule({
  declarations: [
    CommisionComponent
  ],
  imports: [
    CommonModule,
    CommisionRoutingModule,
    SharedModule
  ],providers:[ReportsService,DatePipe ]
})
export class CommisionModule { }
