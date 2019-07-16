import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
/**
 * Generated class for the ShowMoreUserAccountOptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'show-more-user-account-options',
  templateUrl: 'show-more-user-account-options.html'
})
export class ShowMoreUserAccountOptionsComponent {


  constructor(public viewCtrl: ViewController)
  {
    console.log('Hello ShowMoreUserAccountOptionsComponent Component');
    
  }

  selectOption(num)
  {
    console.log("In select");
    let data = {
      selectedOption: num
    }
    this.viewCtrl.dismiss(data);
  }


}
