import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentListPage } from './appointment-list';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    AppointmentListPage,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentListPage),
    ComponentsModule
  ],
  entryComponents: [AppointmentListPage]
})
export class AppointmentListPageModule
{
}
