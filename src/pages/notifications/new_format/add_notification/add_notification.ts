import { Component } from "@angular/core";
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'add_notification',
  templateUrl:'add_notification.html'
})
export class AddNotificationPage
{
  n_date: string = String(new Date());
  n_time: string = String(new Date());
  n_subject: string='';
  n_description: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams)
  {

  }

  addNotification()
  {

  }

  goBack()
  {
    this.navCtrl.pop();
  }
}
