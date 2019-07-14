import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientDetailsComponent } from './client-details/client-details';
import { NoRecordFoundComponent } from './no-record-found/no-record-found';
import { RemindersDetailComponent } from './reminders-detail/reminders-detail';
import { CommonModule } from '@angular/common';
import { ClientDetailActionsComponent } from './client-detail-actions/client-detail-actions';
import { SmsDetailComponent } from './sms-detail/sms-detail';
import { ClientCommunicationDetailsComponent } from './client-communication-details/client-communication-details';
import { SendSecureEmailComponent } from './send-secure-email/send-secure-email';
import { NotificationDetailsComponent } from './notification-details/notification-details';
import { AddBalanceInPaymentComponent } from './add-balance-in-payment/add-balance-in-payment';
import { EditClientHearingComponent } from './edit-client-hearing/edit-client-hearing';
import { AddClientHearingComponent } from './add-client-hearing/add-client-hearing';

@NgModule({
	declarations: [ClientDetailsComponent,
    NoRecordFoundComponent,
    RemindersDetailComponent,
    ClientDetailActionsComponent,
    SmsDetailComponent,
    ClientCommunicationDetailsComponent,
    SendSecureEmailComponent,
    NotificationDetailsComponent,
    AddBalanceInPaymentComponent,
    EditClientHearingComponent,
    AddClientHearingComponent],
  imports: [IonicPageModule.forChild(ClientDetailActionsComponent), CommonModule],
  entryComponents: [ClientDetailsComponent,
    RemindersDetailComponent,
    NoRecordFoundComponent,
    ClientDetailActionsComponent,
    SmsDetailComponent,
    ClientCommunicationDetailsComponent,
    SendSecureEmailComponent,
    NotificationDetailsComponent,
    AddBalanceInPaymentComponent,
    EditClientHearingComponent,
    AddClientHearingComponent
  ],
	exports: [ClientDetailsComponent,
    NoRecordFoundComponent,
    RemindersDetailComponent,
    ClientDetailActionsComponent,
    SmsDetailComponent,
    ClientCommunicationDetailsComponent,
    SendSecureEmailComponent,
    NotificationDetailsComponent,
    AddBalanceInPaymentComponent,
    EditClientHearingComponent,
    AddClientHearingComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}

