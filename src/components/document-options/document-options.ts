import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DocumentOptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'document-options',
  templateUrl: 'document-options.html'
})
export class DocumentOptionsComponent
{

  text: string;
  showDelete = false;
  showShare = false;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController
  )
  {
    console.log('Hello DocumentOptionsComponent Component');
    this.text = 'Hello World';
  }

  ionViewDidLoad()
  {
    this.showDelete = this.navParams.get('showDelete');
    this.showShare = this.navParams.get('showShare');
  }

  selectOption(index)
  {
    console.log('Selected Option=' + index);
    let data = {
      selectedOption:index
    };
    this.viewCtrl.dismiss(data); //Dismiss the popup once an item is selected
  }


}
