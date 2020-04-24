import { Pipe, PipeTransform } from '@angular/core';
import { BrMaskerIonicServices3, BrMaskModel } from 'brmasker-ionic-3';

/**
 * Generated class for the BrContactMaskPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'brContactMask',
})
export class BrContactMaskPipe implements PipeTransform
{
  /**
   * Takes a value and makes it lowercase.
   */

  constructor(public brMasker: BrMaskerIonicServices3)
  {

  }


  transform(value: string, ...args)
  {
    let brMask = new BrMaskModel();
    brMask.mask = '(000)-000-0000';
    brMask.len = 14;
    brMask.type = 'num';
    return this.brMasker.writeCreateValue(value, brMask);
  }
}
