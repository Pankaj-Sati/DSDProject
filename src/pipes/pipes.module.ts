import { NgModule } from '@angular/core';
import { Convert24HourTimePipe } from './convert24-hour-time/convert24-hour-time';
import { BrContactMaskPipe } from './br-contact-mask/br-contact-mask';
@NgModule({
	declarations: [Convert24HourTimePipe,
    BrContactMaskPipe],
  imports: [],
  providers: [BrContactMaskPipe, Convert24HourTimePipe],
	exports: [Convert24HourTimePipe,
    BrContactMaskPipe]
})
export class PipesModule {}
