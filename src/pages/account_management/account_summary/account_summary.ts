import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { UserAccount } from '../../../models/user_account.model';
import { SingleUserAccountPage } from '../single_user_account/single_user_account';
import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { AdvocateListProvider } from '../../../providers/advocate-list/advocate-list';

import {AccountSummaryDetailsComponent } from '../../../components/account-summary-details/account-summary-details';
import { AccountSummary} from '../../../models/account_summary.model'

@Component({
	selector: 'account_summary',
	templateUrl: 'account_summary.html'
})

export class AccountSummaryPage
{
	a_pay_mode:string='';
	a_pay_status:string='';
	c_pay_from:string='';
	c_pay_to:string='';

  setDetailVisible: boolean = false;
  blurAmount: string = '';
 
  accounts: AccountSummary[] = [];
  detailAccount: AccountSummary;


  constructor(
    public modalCtrl: ModalController,
    public advocateListProvider: AdvocateListProvider,
    public events: Events,
    public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController) 
  {
    this.fetchData();
  }

  fetchData()
  {
    
    this.accounts = [];

    const loader = this.loading.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {
      /*http://myamenbizzapp.com/dsd/api_work/account_summary.php?payment_mode=REGISTRATION CHARGES
       * &payment_status=Outstanding&from_date=2019-07-03
       * &to_date=2019-07-17
       */
      let body = new FormData();

      body.append('payment_mode', this.a_pay_mode);
      body.append('payment_status', this.a_pay_status);
      body.append('from_date', this.c_pay_from);
      body.append('to_date', this.c_pay_to);

      this.http.post(this.apiValue.baseURL + "/account_summary.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                this.showToast(data.message);
                return;
              }
              else
              {
                this.accounts = data;

              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Timeout!!! Server did not respond');
      }

    });

  }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });

    toast.present();
  }

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
    }

  hideDetails()
  {
    this.setDetailVisible = false;
    this.blurAmount = '';
  }

  showDetails(account: AccountSummary)
  {

    let data =
    {
      accountDetails:account
    };
    const modal = this.modalCtrl.create(AccountSummaryDetailsComponent, data);

    modal.present();
    this.blurAmount = 'blurDiv';

    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
    });

  }
}


