import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComicsPage } from './comics';

@NgModule({
  declarations: [
    ComicsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComicsPage),
  ],
})
export class ComicsPageModule {}
