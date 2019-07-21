import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpPage } from './sign-up';
import { BrMaskerModule } from 'brmasker-ionic-3';

import { SignupSuccessPage} from './signup_success/signup_success';

@NgModule({
  declarations: [
    SignUpPage,
    SignupSuccessPage
  ],
  imports: [
    IonicPageModule.forChild(SignUpPage),
    BrMaskerModule
  ],
  entryComponents: [SignUpPage,
    SignupSuccessPage]
})
export class SignUpPageModule {}
