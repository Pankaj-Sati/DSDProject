import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { ClientDetailsComponent } from './client-details/client-details';
import { NoRecordFoundComponent } from './no-record-found/no-record-found';
import { RemindersDetailComponent } from './reminders-detail/reminders-detail';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [ClientDetailsComponent,
    NoRecordFoundComponent,
    RemindersDetailComponent],
  imports: [CommonModule],
  entryComponents: [ClientDetailsComponent, RemindersDetailComponent, NoRecordFoundComponent],
	exports: [ClientDetailsComponent,
    NoRecordFoundComponent,
    RemindersDetailComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}

