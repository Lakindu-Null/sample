import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VolumeTypeRoutingModule } from './volume-type-routing.module';
import { VolumeTypeComponent } from './volume-type.component';
import { VolumeTypeService } from 'src/app/services/volumeType.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    VolumeTypeComponent
  ],
  imports: [
    CommonModule,
    VolumeTypeRoutingModule,
    SharedModule
  ],
  providers: [VolumeTypeService]
})
export class VolumeTypeModule { }
