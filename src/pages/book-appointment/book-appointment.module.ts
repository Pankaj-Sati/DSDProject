import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookAppointmentPage } from './book-appointment';

@NgModule({
  declarations: [
    BookAppointmentPage,
  ],
  imports: [
    IonicPageModule.forChild(BookAppointmentPage),
  ],
  entryComponents: [BookAppointmentPage]
})
export class BookAppointmentPageModule {}
