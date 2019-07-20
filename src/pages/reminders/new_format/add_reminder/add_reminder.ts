import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { Client } from '../../../../models/client.model';
import { User } from '../../../../models/login_user.model';

@Component({
  selector: 'add_reminder',
  templateUrl:'add_reminder.html'
})
export class AddReminderPage
{
  r_date: string = String(new Date());
  r_time: string = String(new Date());
  r_subject: string='';
  r_description: string = '';
  clientList: Client[] = [];
  selectedClients: Client[] = [];

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
    public menuCtrl: MenuController,
    public myStorage: MyStorageProvider)
  {
    this.fetchData();
  }

  addReminder()
  {

  }

  goBack()
  {
    this.navCtrl.pop();
  }

  fetchData()
  {

    var headers = new Headers();
    this.clientList = [];

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
            this.clientList = serverReply;
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

  addClient(client: Client)
  {
    this.selectedClients.push(client);
    let index = this.clientList.findIndex(clientInList => clientInList.id == client.id);
    this.clientList.splice(index, 1); //Remove the selected client from client list
  }

  removeClient(index)
  {
    let client = this.selectedClients[index];
    this.selectedClients.splice(index, 1); //Delete 1 element at index

    this.clientList.push(client); //Add the removed client back to the client list
  }
}
