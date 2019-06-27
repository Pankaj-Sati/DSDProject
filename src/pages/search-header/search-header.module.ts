import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchHeaderPage } from './search-header';
import {ComponentsModule} from '../../components/components.module';
import {CaseDetailsPage} from './case_details/case_details';


@NgModule({
  declarations: [
    SearchHeaderPage,CaseDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(SearchHeaderPage),
    ComponentsModule
  ],
  entryComponents:[CaseDetailsPage]
})
export class SearchHeaderPageModule {}
