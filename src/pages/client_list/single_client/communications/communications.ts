import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams } from 'ionic-angular';
import { LoadingController, ToastController, ModalController } from 'ionic-angular';

import { User } from '../../../../models/login_user.model';
import { Client } from '../../../../models/client.model';
import { ClientCommunications } from '../../../../models/client_communications.model';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { ClientCommunicationDetailsComponent } from '../../../../components/client-communication-details/client-communication-details';
import {SendSecureEmailComponent } from '../../../../components/send-secure-email/send-secure-email';

@Component({

  selector: 'communications',
  templateUrl:'communications.html'
})
export class ClientCommunicationsPage
{

  loggedInUser: User;
  passed_client: Client;
  search_string='';
  blurAmount: string = '';
  communication_list: ClientCommunications[] = [];

  constructor
    (
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public apiValues: ApiValuesProvider,
    public myStorage: MyStorageProvider,
    public http: Http
    )
  {
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad()
  {
    this.passed_client= this.navParams.get('client');
    this.fetchData();
  }

  fetchData()
  {
    const loader = this.loadingCtrl.create({
      content: 'Loading...',
      duration:15000
    });

    let loadingSuccessful = false;

    loader.present();

    console.log("Fetching Communications for ID=" + this.passed_client.id);
    console.log("Fetching Communications for search=" + this.search_string);
    let body = new FormData();
    body.append('cid', String(this.passed_client.id));
    body.append('search', this.search_string);

    this.http.get(this.apiValues.baseURL + "/get_communication_email_list.php?cid=" + this.passed_client.id + "&search=" + this.search_string)
      .subscribe(response =>
      {
        loadingSuccessful = true;
        loader.dismiss();
        console.log(response);
        if (response)
        {
          try
          {
            let result = JSON.parse(response['_body']);
            if ('code' in result)
            {
              //Error
              this.presentToast(result.message);
            }
            else
            {
              //Success
              this.communication_list = result;
            }
          }
          catch (err)
          {
            console.log(err);
            this.presentToast('Failed to get data!!!');
          }
         
        }

        else
        {
         
          this.presentToast('Error!!! Server respond with a failure');
        }

      }, error =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          console.log(error);
          this.presentToast('Error!!! Server respond with a failure');
        });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentToast('Error!!! Server did not respond');
      }
    });

  }

  presentToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration:3000
    });

    toast.present();
  }

  sendEmail()
  {

    let data = {
      client: this.passed_client
    }
    const modal = this.modalCtrl.create(SendSecureEmailComponent, data);

    modal.present();
    this.blurAmount = 'blurDiv';

    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
    });
  }

  viewCommunication(communication: ClientCommunications)
  {
    let data = {
      communication: communication
    };
    const modal = this.modalCtrl.create(ClientCommunicationDetailsComponent, data);

    modal.present();

    this.blurAmount = 'blurDiv';

    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
    });
  }
}
