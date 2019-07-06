import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the ClientDetailActionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'client-detail-actions',
  templateUrl: 'client-detail-actions.html'
})
export class ClientDetailActionsComponent
{

  constructor(public viewCtrl: ViewController)
  {
    //ViewController is used to dismiss the popup component and send the data along with the dismiss callback
    console.log('Hello ClientDetailActionsComponent Component');
  
  }

  selectOption(num)
  {
    console.log("In select");
    let data = {
      selectedOption:num
    }
    this.viewCtrl.dismiss(data);
  }

}
