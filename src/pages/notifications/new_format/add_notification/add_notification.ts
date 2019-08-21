import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';
import { Convert24HourTimePipe } from '../../../../pipes/convert24-hour-time/convert24-hour-time';

import { Client } from '../../../../models/client.model';
import { User } from '../../../../models/login_user.model';

@Component({
  selector: 'add_notification',
  templateUrl:'add_notification.html'
})
export class AddNotificationPage
{
  n_date: string = String(new Date());
  n_time: string = String(new Date());
  n_subject: string='';
  n_description: string = '';
  clientList: Client[] = [];
  selectedClients: Client[] = [];

  loggedInUser: User;

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
    public myStorage: MyStorageProvider,
    public convert24To12: Convert24HourTimePipe)
  {
    this.loggedInUser = this.myStorage.getParameters();
    this.fetchData();
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

  addNotification()
  {
    const loader = this.loading.create({

      content: 'Adding...',
      duration: 15000
    });
    let loadingSuccessful = false;//To know whether timeout occured or not

    loader.present().then(() =>
    {

      let body = new FormData();

      body.set('notificationDate', this.n_date);
      body.set('notificationTime', this.convert24To12.transform(this.n_time));
      body.set('subject', this.n_subject);
      body.set('disc', this.n_description);
      body.set('client', this.getSelectedClientsParameters());
      body.set('session_id', this.loggedInUser.id);

      this.http.post(this.apiValue.baseURL + '/add_notification.php', body, null)
        .subscribe(response =>
        {
          console.log(response);
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            try
            {
              let data = JSON.parse(response['_body']);
              if (('code' in data) && data.code > 400)
              {
                //error
                this.showToast(data.message);

                return;
              }
              else
              {
                //Success
                this.showToast(data.message);
                this.navCtrl.getPrevious().data.reload = true;
                this.navCtrl.pop();

                return;
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

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            loader.dismiss();
          });
    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Failure!!! Server did not respond');
      }
    });

  }

getSelectedClientsParameters(): string
{
  let param: string = '';
  for (let i = 0; i < this.selectedClients.length; i++)
  {

    param = param + this.selectedClients[i].id;

    if (i < this.selectedClients.length - 1)
    {
      param = param + ","
    }

  }

  return param;
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
