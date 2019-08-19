import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the Convert24HourTimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'convert24HourTime',
})
export class Convert24HourTimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(time: any)
  {
    if (time == undefined || time == null || time.length == 0)
    {
      return 'N/A';
    }

    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour >= 12 ? 'pm' : 'am';
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`
  }


}
