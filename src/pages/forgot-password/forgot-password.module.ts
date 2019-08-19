import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPasswordPage } from './forgot-password';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    ForgotPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPasswordPage), BrMaskerModule
  ],
  entryComponents: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
