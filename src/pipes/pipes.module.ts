import { NgModule } from '@angular/core';
import { Convert24HourTimePipe } from './convert24-hour-time/convert24-hour-time';
import { BrContactMaskPipe } from './br-contact-mask/br-contact-mask';
import { CustomDateFormatPipe } from './custom-date-format/custom-date-format';
import { Convert12HourTo24Pipe } from './convert12-hour-to24/convert12-hour-to24';
@NgModule({
	declarations: [Convert24HourTimePipe,
    BrContactMaskPipe,
    CustomDateFormatPipe,
    Convert12HourTo24Pipe],
  imports: [],
  providers: [BrContactMaskPipe, Convert24HourTimePipe, CustomDateFormatPipe, Convert12HourTo24Pipe],
	exports: [Convert24HourTimePipe,
    BrContactMaskPipe,
    CustomDateFormatPipe,
    Convert12HourTo24Pipe]
})
export class PipesModule {}
