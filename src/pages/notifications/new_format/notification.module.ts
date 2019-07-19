import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';

//Pages
import { AddNotificationPage } from './add_notification/add_notification';
import { NotificationListPage } from './notification_list/notification_list';

//Components
import {ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [AddNotificationPage, NotificationListPage],
  imports: [IonicPageModule.forChild(AddNotificationPage), ComponentsModule],
  entryComponents: [AddNotificationPage, NotificationListPage]
})
export class NotificationsModule
{

}
