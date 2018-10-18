import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HeroisPage } from './herois';

@NgModule({
  declarations: [
    HeroisPage,
  ],
  imports: [
    IonicPageModule.forChild(HeroisPage),
  ],
})
export class HeroisPageModule {}
