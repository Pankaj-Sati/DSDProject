import { NgModule } from '@angular/core';
import { Convert24HourTimePipe } from './convert24-hour-time/convert24-hour-time';
import { BrContactMaskPipe } from './br-contact-mask/br-contact-mask';
import { CustomDateFormatPipe } from './custom-date-format/custom-date-format';
@NgModule({
	declarations: [Convert24HourTimePipe,
    BrContactMaskPipe,
    CustomDateFormatPipe],
  imports: [],
  providers: [BrContactMaskPipe, Convert24HourTimePipe, CustomDateFormatPipe],
	exports: [Convert24HourTimePipe,
    BrContactMaskPipe,
    CustomDateFormatPipe]
})
export class PipesModule {}
