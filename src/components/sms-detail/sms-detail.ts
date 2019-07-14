import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';

import { SMS } from '../../models/sms.model';
/**
 * Generated class for the SmsDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sms-detail',
  templateUrl: 'sms-detail.html'
})
export class SmsDetailComponent
{
  smsDetail: SMS;

  constructor
    (
    public navCtrl: NavController,
    public navParams: NavParams
    )
  {
    console.log('Hello SmsDetailComponent Component');

  }

  ionViewDidLoad()
  {
    this.smsDetail = this.navParams.get('sms');
    console.log('SMS Received by SMS Component');
    console.log(this.smsDetail);
  }

}
