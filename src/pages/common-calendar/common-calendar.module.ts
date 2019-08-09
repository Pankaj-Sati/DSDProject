import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonCalendarPage } from './common-calendar';

@NgModule({
  declarations: [
    CommonCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonCalendarPage),
  ],
  entryComponents: [CommonCalendarPage]
})
export class CommonCalendarPageModule {}
