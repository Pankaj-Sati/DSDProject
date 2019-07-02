import { NgModule } from '@angular/core';
import { ClientDetailsComponent } from './client-details/client-details';
import { NoRecordFoundComponent } from './no-record-found/no-record-found';
@NgModule({
	declarations: [ClientDetailsComponent,
    NoRecordFoundComponent],
	imports: [],
	entryComponents:[ClientDetailsComponent],
	exports: [ClientDetailsComponent,
    NoRecordFoundComponent]
})
export class ComponentsModule {}
