import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { BranchService } from 'src/app/services/branch.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BranchComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    SharedModule
  ],
  providers:[BranchService]
})
export class BranchModule { }
