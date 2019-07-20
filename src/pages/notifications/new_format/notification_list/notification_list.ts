import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';


import {NewNotification} from '../../../../models/notification.model';

@Component({
  selector: 'notification_list',
  templateUrl:'notification_list.html'
})
export class NotificationListPage
{
  notificationList: NewNotification[] = [];
  visibility: boolean[] = [];

  constructor(public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public apiValue: ApiValuesProvider,
    public menuCtrl: MenuController,
    public myStorage: MyStorageProvider)
  {
    this.notificationList = [
      { id: 1, date: '12-06-2019', subject: 'My Subject', description: 'Descridjkndjkn', user: 'My User1, 23', created_date: '08-05-2019', action: 'Number 1' },
      { id: 2, date: '12-06-2019', subject: 'My Subject3', description: '213Descridjkndjkn', user: 'My 23User1, 23', created_date: '08-05-2019', action: 'Number 1' },
      { id: 3, date: '12-06-2019', subject: 'My Subject8', description: '213Descridjkndjkn', user: 'My 23User1, 23', created_date: '08-05-2019', action: 'Number 1' },
      { id: 4, date: '12-06-2019', subject: 'My Subject980', description: '21fdfdgfdg3Descridjkndjkn', user: 'My 23User1, 23', created_date: '08-05-2019', action: 'Number 1' },
      ]
  }
  


  fetchData()
  {

    var headers = new Headers();
    this.notificationList = [];

    headers.append("Accept", "application/json");

    headers.append("Content-Type", "application/json");

    let options = new RequestOptions({ headers: headers });
    let body = new FormData();

    let loader = this.loading.create({

      content: "Loading ...",
      duration: 15000

    });
    let loadingSuccessful = false;//To know whether timeout occured or not
    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/client_list.php", body, null) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          console.log(serverReply);
          loader.dismiss();

          if ('message' in serverReply || 'code' in serverReply)
          {
            this.showToast(serverReply.message)
          }
          else
          {
            this.notificationList = serverReply;
          }



        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);

            this.showToast('Error in getting data');
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

  showDetails(notification, $event, i)
  {
    
    this.visibility[i] = !this.visibility[i];
  }

}
