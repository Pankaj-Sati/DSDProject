import { Component, Input } from '@angular/core';

/**
 * Generated class for the ProgressBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent
{
  @Input('progress') progress:any=10; //@Input is used to receive input from parent's variable
  
  ngOnInit()
  {
    console.log('Progress: ' + this.progress);
  }

  constructor()
  {
    console.log('Hello ProgressBarComponent Component');
  }


}
