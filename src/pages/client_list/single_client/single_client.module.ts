import { NgModule } from '@angular/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeManagerPage } from './change_manager/change_manager';
import { SingleClientPage } from './single_client';
import { SendSMSPage } from './send_sms/send_sms';

import { ComponentsModule } from '../../../components/components.module';


@NgModule({
  declarations: [SendSMSPage, ChangeManagerPage, SingleClientPage],
  imports: [
    IonicPageModule.forChild(SingleClientPage),
    ComponentsModule],
  providers: [],
  entryComponents: [SendSMSPage, ChangeManagerPage, SingleClientPage],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SingleClientModule { }
