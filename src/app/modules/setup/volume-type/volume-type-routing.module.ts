import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VolumeTypeComponent } from './volume-type.component';

const routes: Routes = [{ path: '', component: VolumeTypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolumeTypeRoutingModule { }
