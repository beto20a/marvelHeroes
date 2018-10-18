import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabMenuPage } from './tab-menu';

@NgModule({
  declarations: [
    TabMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(TabMenuPage),
  ],
})
export class TabMenuPageModule {}
