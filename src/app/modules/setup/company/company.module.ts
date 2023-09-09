import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyService } from 'src/app/services/company.service';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    CompanyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SharedModule
  ],
  providers:[CompanyService,MessageService]
})
export class CompanyModule { }
