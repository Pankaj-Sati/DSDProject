import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { AccountSummary} from '../../models/account_summary.model';

@Component({
  selector: 'account-summary-details',
  templateUrl: 'account-summary-details.html'
})
export class AccountSummaryDetailsComponent {

  accountDetails: AccountSummary;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController
  )
  {
    console.log('Hello AccountSummaryDetailsComponent Component');
   
  }

  ionViewDidLoad()
  {
    this.accountDetails = this.navParams.get('accountDetails');
    console.log('------Account Details Received-------');
    console.log(this.accountDetails);
  }

  dismissPage()
  {
    this.navCtrl.pop();
  }

}
