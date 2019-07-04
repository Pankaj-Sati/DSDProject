import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { ClientDetailsComponent } from './client-details/client-details';
import { NoRecordFoundComponent } from './no-record-found/no-record-found';
import { RemindersDetailComponent } from './reminders-detail/reminders-detail';
import { CommonModule } from '@angular/common';
import { ClientDetailActionsComponent } from './client-detail-actions/client-detail-actions';
import { SmsDetailComponent } from './sms-detail/sms-detail';

@NgModule({
	declarations: [ClientDetailsComponent,
    NoRecordFoundComponent,
    RemindersDetailComponent,
    ClientDetailActionsComponent,
    SmsDetailComponent],
  imports: [CommonModule],
  entryComponents: [ClientDetailsComponent, RemindersDetailComponent, NoRecordFoundComponent, ClientDetailActionsComponent, SmsDetailComponent],
	exports: [ClientDetailsComponent,
    NoRecordFoundComponent,
    RemindersDetailComponent,
    ClientDetailActionsComponent,
    SmsDetailComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}

