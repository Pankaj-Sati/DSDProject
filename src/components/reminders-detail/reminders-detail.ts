import { Component } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
/**
 * Generated class for the RemindersDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

import { Reminder } from '../../models/reminder.model';

@Component({
  selector: 'reminders-detail',
  templateUrl: 'reminders-detail.html'
})
export class RemindersDetailComponent 
{

  
  reminder: Reminder;

  constructor(public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController)
  {
    console.log('Hello RemindersDetailComponent Component');
    this.reminder = this.navParams.get('reminder');
    console.log(this.reminder);
  }

  dismissPage()
  {
    this.viewCtrl.dismiss("Dismissed Modal");
  }

}
