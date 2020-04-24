import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the Convert12HourTo24Pipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 *
 *
 */

import { CustomDateFormatPipe} from '../custom-date-format/custom-date-format';
@Pipe({
  name: 'convert12HourTo24',
})
export class Convert12HourTo24Pipe implements PipeTransform {
  /**
   * Takes a value and converts it into 24 Hour time
   */

  constructor(public customDateFormat: CustomDateFormatPipe)
  {

  }

  transform(time: string, ...args)
  {
    if (time == undefined || time == null || time.length == 0)
    {
      return 'N/A';
    }

    if (! (String(time).toLocaleLowerCase().includes('m')))
    {
      //A 12 hour time format will contain time as 07:09 AM or 09:20 PM
      //Both format has 'm' in common
      //Therefore, if time doesnot contains m in it, that means it is already in 24 hour format

      return time; //Return the same value without modifying it
    }

        const [myTime, modifier] = time.split(' ');

        let [hours, minutes] = myTime.split(':');

        if (hours === '12')
        {
          hours = '00';
        }

        if (modifier === 'PM')
        {
          hours = String(parseInt(hours, 10) + 12); //Add 12 to hours if modifier is PM 
        }

    return `${hours}:${minutes}`; //Convert the given time into 24 hour format
  }
}
