import { NgModule } from '@angular/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrMaskerModule } from 'brmasker-ionic-3';

import { ChangeManagerPage } from './change_manager/change_manager';
import { SingleClientPage } from './single_client';
import { SendSMSPage } from './send_sms/send_sms';
import { NotesListPage } from './notes/notes';
import { AddNotesPage } from './notes/add_notes/add_notes';
import { ClientDocumentsPage } from './document/document';
import { ClientCommunicationsPage } from './communications/communications';
import { ClientPaymentPage } from './payment/payment';
import { HearingDetailsPage } from './hearing_details/hearing_details';
import { EditClientPage } from './edit_client/edit_client';
import { AddCaseHistoryPage } from './notes/add_case_history/add_case_history';

import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';


@NgModule({
  declarations: [SendSMSPage, ChangeManagerPage, SingleClientPage,
    NotesListPage, AddNotesPage, ClientDocumentsPage, ClientCommunicationsPage,
    ClientPaymentPage, HearingDetailsPage, EditClientPage, AddCaseHistoryPage],
  imports: [
    IonicPageModule.forChild(SingleClientPage),
    BrMaskerModule,
    ComponentsModule,
    PipesModule],
  providers: [],
  entryComponents: [SendSMSPage, ChangeManagerPage, SingleClientPage,
    NotesListPage, AddNotesPage, ClientDocumentsPage, ClientCommunicationsPage,
    ClientPaymentPage, HearingDetailsPage, EditClientPage, AddCaseHistoryPage],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SingleClientModule { }
