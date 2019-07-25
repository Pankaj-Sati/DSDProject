import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookAppointmentAtLoginPage } from './book-appointment-at-login';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    BookAppointmentAtLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(BookAppointmentAtLoginPage),
    BrMaskerModule
  ],
  entryComponents: [BookAppointmentAtLoginPage]
})
export class BookAppointmentAtLoginPageModule {}
