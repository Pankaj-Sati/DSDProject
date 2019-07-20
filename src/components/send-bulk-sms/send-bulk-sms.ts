import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';

import { Client } from '../../models/client.model';
import { User } from '../../models/login_user.model';

@Component({
  selector: 'send-bulk-sms',
  templateUrl: 'send-bulk-sms.html'
})
export class SendBulkSmsComponent
{

  clientList: Client[] = [];
  loggedInUser: User;
  sms_body:string='';
  selectedClients: Client[] = [];

  constructor
    (
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
    public myStorage: MyStorageProvider
    )
  {
    console.log('Hello SendBulkSmsComponent Component');
    this.loggedInUser = this.myStorage.getParameters();
    this.fetchData();
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
      duration:15000

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

  sendSMS()
  {
    /*
     * http://myamenbizzapp.com/dsd/api_work/add_bulk_sms.php?
     * sms_text=TEST APP BULK SMS&client=112,116&session_id=1
      */
    let loader = this.loading.create({

      content: "Sending ...",
      duration: 15000

    });

    let loadingSuccessful = false;//To know whether loading timeout happened or not

    let body = new FormData();
    body.append('sms_text', String(this.sms_body).trim());
    body.append('session_id', String(this.loggedInUser.id).trim());
    body.append('client', String(this.getSelectedClientsParameters()).trim());

    console.log(this.getSelectedClientsParameters());

   // body.forEach((value, key) => { console.log("key:" + key + " Value=" + value); });
    
    loader.present().then(() => 
    {

      this.http.get(this.apiValue.baseURL + "/add_bulk_sms.php?sms_text=" + this.sms_body + "&session_id=" + this.loggedInUser.id + "&client=" + String(this.getSelectedClientsParameters()).trim()) //Http request returns an observable

        .subscribe(response =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          console.log(response);
          loadingSuccessful = true;
          console.log(response);
          loader.dismiss();

          if (response)
          {
            try
            {
              let serverReply = JSON.parse(response['_body']);

              if ('message' in serverReply) //Server Replied
              {
                this.showToast(serverReply.message);
                if (serverReply.code == 200)
                {
                  this.dismissPage();
                }
              
              }
              else
              {
                this.showToast("Failed to send sms!!! ");
              }
            }
            catch (err)
            {
              this.showToast("Failed to send sms!!! ");
            }


          }
          else
          {
            this.showToast("Failed to send sms!!! ");
          }

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            this.showToast("Error in sending sms ");
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.showToast("Timeout!!! Server did not respond ");
      }
    });


  }

  dismissPage()
  {
    this.navCtrl.pop();
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
}
