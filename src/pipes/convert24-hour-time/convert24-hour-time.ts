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
      console.log('convert24HourTime=N/A');
      return 'N/A';
    }

    if (String(time).toLocaleLowerCase().includes('m'))
    {
      //A 12 hour time format will contain time as 07:09 AM or 09:20 PM
      //Both format has 'm' in common
      //Therefore, if out time contains m in it, that means it is already in 12 hour format
      console.log('convert24HourTime='+time);
      return time; //Return the same value without modifying it
    }

    //If time is in 24 hours format, we will convert it into 12 HOurs

    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    let part = hour >= 12 ? 'PM' : 'AM';
    min = (min + '').length == 1 ? `0${min}` : min;
    hour = hour > 12 ? hour - 12 : hour;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    console.log('convert24HourTime=' + `${hour}:${min} ${part}`);
    return `${hour}:${min} ${part}`
  }


}
