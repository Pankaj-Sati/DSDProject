import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

/**
 * Generated class for the NotificationDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'notification-details',
  templateUrl: 'notification-details.html'
})
export class NotificationDetailsComponent
{

  notification;

  constructor
    (
    public navParams: NavParams,
    public navCtrl: NavController
    )
  {
    console.log('Hello NotificationDetailsComponent Component');
  
  }

  ionViewDidLoad()
  {
    this.notification = this.navParams.get('notification');
  }

  dismissPage()
  {
    this.navCtrl.pop();
  }

}
