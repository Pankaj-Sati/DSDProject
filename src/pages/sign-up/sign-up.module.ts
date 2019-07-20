import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpPage } from './sign-up';
import { BrMaskerModule} from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpPage),
    BrMaskerModule
  ],
  entryComponents: [SignUpPage]
})
export class SignUpPageModule {}
