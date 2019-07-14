import {Component} from '@angular/core';
import { Events, Popover } from 'ionic-angular';
import { LoadingController, ToastController, PopoverController, PopoverOptions, ModalController, ModalOptions  } from 'ionic-angular';
import { Http } from "@angular/http";

import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import {SmsDetailComponent } from '../../../components/sms-detail/sms-detail';
import { SMS } from '../../../models/sms.model';


@Component({
	selector: 'smslist',
	templateUrl: 'smslist.html'
})

export class SMSListPage
{
  sms_list:SMS[]=[];
  smsDetail: SMS;
  s_from: string=''; //For searching sms
  s_to: string='';//For searching sms
  s_search: string = '';//Search string
  visibility: boolean[] = [];
 

  constructor
    (
    public events: Events,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public http: Http,
    public apiValues: ApiValuesProvider,
    public modalCtrl: ModalController
    )
	{
      this.fetchData();
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
    }

  hideDetails()
  {
    
  }


  showDetails(smsSelected,showEvent,i)
  {
    /*
    let option: PopoverOptions = {
 
    };
    const popover = this.popoverCtrl.create(SmsDetailComponent, { sms: smsSelected }, option);

    popover.present({
      ev: showEvent
    });
    */

    /*
    let options: ModalOptions = {
     
    };
    const modal = this.modalCtrl.create(SmsDetailComponent, { sms: smsSelected });
    modal.present();
    */

    this.visibility[i] = !this.visibility[i];


  }

  searchSMS()
  {

  }

  fetchData()
  {

    this.sms_list = [];
    this.visibility = [];

    const loader = this.loadingCtrl.create({

      content: 'Loading...',
      duration:15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() => {

      let body = new FormData();
      body.append('from_date', this.s_from);
      body.append('to_date', this.s_to);
      body.append('client_id', this.s_search);

      this.http.post(this.apiValues.baseURL + "/sms_list.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try {
              let data = JSON.parse(response['_body']);

              if ('code' in data) {
                this.showToast(data.message);
                return;
              }
              else
              {
                this.sms_list = data;
                for (let i = 0; i < this.sms_list.length; i++)
                {
                  this.visibility[i] = false;
                }
               
              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!!');
            }
           
          }
          else
          {
            this.showToast('Failure!!!');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
        });

    });

    loader.onDidDismiss(() => {

      if (!loadingSuccessful)
      {
        this.showToast('Error!!! Server did not respond');
      }

    });

  }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration:3000
    });

    toast.present();
  }
}

