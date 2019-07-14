import { NgModule } from '@angular/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeManagerPage } from './change_manager/change_manager';
import { SingleClientPage } from './single_client';
import { SendSMSPage } from './send_sms/send_sms';
import { NotesListPage } from './notes/notes';
import { AddNotesPage } from './notes/add_notes/add_notes';
import { ClientDocumentsPage } from './document/document';
import { ClientCommunicationsPage } from './communications/communications';
import { ClientPaymentPage } from './payment/payment';
import { HearingDetailsPage } from './hearing_details/hearing_details';


import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [SendSMSPage, ChangeManagerPage, SingleClientPage,
    NotesListPage, AddNotesPage, ClientDocumentsPage, ClientCommunicationsPage,
    ClientPaymentPage, HearingDetailsPage],
  imports: [
    IonicPageModule.forChild(SingleClientPage),
    ComponentsModule],
  providers: [],
  entryComponents: [SendSMSPage, ChangeManagerPage, SingleClientPage,
    NotesListPage, AddNotesPage, ClientDocumentsPage, ClientCommunicationsPage,
    ClientPaymentPage, HearingDetailsPage],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SingleClientModule { }
