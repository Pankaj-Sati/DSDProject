import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { BulkSmsDetailComponent } from '../../../components/bulk-sms-detail/bulk-sms-detail';
import { SendBulkSmsComponent } from '../../../components/send-bulk-sms/send-bulk-sms';
import { BulkSMS } from '../../../models/bulk_sms.model';
import { ApiValuesProvider } from '../../../providers/api-values/api-values';

@Component({
	selector: 'bulkemail',
	templateUrl: 'bulkemail.html'
})

export class SMSBulkEmailPage
{
  smsList: BulkSMS[] = [];
  blurAmount: string = '';



  constructor(
    public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public apiValue: ApiValuesProvider,
    public menuCtrl: MenuController
  )
  {
    this.fetchData();
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
  }

  showDetails(sms)
  {
    let data =
    {
      smsDetail:sms
    };

    const modal = this.modalCtrl.create(BulkSmsDetailComponent,data);
    this.blurAmount = 'blurDiv';
    modal.present();

    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
    });

  }

  fetchData()
  {
    this.smsList = [];
    const loader = this.loading.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {
      
      let body = new FormData();

      //body.append('cid', this.caseDetails.id);

      this.http.post(this.apiValue.baseURL + "/bulk_sms_list.php", body, null)
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
                this.smsList = data;

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

  addSMS()
  {

    const modal = this.modalCtrl.create(SendBulkSmsComponent);
    this.blurAmount = 'blurDiv';
    modal.present();

    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
      this.fetchData();
    });
  }
}

