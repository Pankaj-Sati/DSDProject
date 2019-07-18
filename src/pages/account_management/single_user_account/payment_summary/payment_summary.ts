import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { UserAccount } from '../../../../models/user_account.model';
import { PaymentSummary } from '../../../../models/payment_summary.model';
import { ApiValuesProvider } from '../../../../providers/api-values/api-values';

@Component({
  selector: 'payment_summary',
  templateUrl: 'payment_summary.html'
})

export class PaymentSummaryPage
{

  passedClientID;
  passedAccountDetails: UserAccount;
  visibility: boolean[] = [];
  payments: PaymentSummary[] = [];

  constructor
    (
    public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private http: Http,
    public loading: LoadingController)
  {
  }

  ionViewDidLoad()
  {
    console.log('------------In Payment Summary---------------');
    this.passedClientID = this.navParams.get('clientID');
    this.passedAccountDetails = this.navParams.get('accountDetails');
    console.log(this.passedAccountDetails);
    this.fetchData();
  }

  fetchData()
  {
    this.payments = [];

    const loader = this.loading.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('cid', this.passedClientID);

      this.http.post(this.apiValue.baseURL + "/user_ACmngt_pymntSmry.php", body, null)
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
                this.payments = data;
                for (let i = 0; i < this.payments.length; i++)
                {
                  this.visibility[i] = false;
                }
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

  showDetails(smsSelected, showEvent, i)
  {
    this.visibility[i] = !this.visibility[i];
  }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });

    toast.present();
  }
}
