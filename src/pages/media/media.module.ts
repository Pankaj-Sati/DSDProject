import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MediaPage } from './media';

@NgModule({
  declarations: [
    MediaPage,
  ],
  imports: [
    IonicPageModule.forChild(MediaPage),
  ],
  entryComponents: [MediaPage]
})
export class MediaPageModule {}
