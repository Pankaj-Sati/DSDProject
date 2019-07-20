import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';

//Pages
import { AddReminderPage } from './add_reminder/add_reminder';
import { ReminderListPage } from './reminder_list/reminder_list';

//Components
import {ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [AddReminderPage, ReminderListPage],
  imports: [IonicPageModule.forChild(AddReminderPage), ComponentsModule],
  entryComponents: [AddReminderPage, ReminderListPage]
})
export class RemindersModule
{

}
