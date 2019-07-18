import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { BulkSMS } from '../../models/bulk_sms.model';


@Component({
  selector: 'bulk-sms-detail',
  templateUrl: 'bulk-sms-detail.html'
})
export class BulkSmsDetailComponent {

  smsDetail:BulkSMS;

  constructor
    (
    public navCtrl: NavController,
    public navParams: NavParams
    )
  {
    console.log('Hello BulkSmsDetailComponent Component');
   
  }


  ionViewDidLoad()
  {
    this.smsDetail = this.navParams.get('smsDetail');
    console.log(this.smsDetail);
  }

  dismissPage()
  {
    this.navCtrl.pop();
  }
}
