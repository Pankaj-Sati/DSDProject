import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, NavController } from 'ionic-angular';
import { LoadingController, ToastController, ModalController } from 'ionic-angular';

import { User } from '../../models/login_user.model';
import { SingleUser } from '../../models/user_list.model';
import { Client } from '../../models/client.model';
import { ClientCommunications } from '../../models/client_communications.model';

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';


@Component({
  selector: 'send-secure-email',
  templateUrl: 'send-secure-email.html'
})
export class SendSecureEmailComponent {

  email_body: string;
  subject: string;

  loggedInUser: User;
  passed_client: Client;

  user_list: SingleUser[] = [];

  selected_users: SingleUser[] = [];

  constructor
    (
    public navParams: NavParams,
    public navCtrl: NavController,
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
    this.passed_client = this.navParams.get('client');
    console.log(this.passed_client);
    this.fetchUserList();
  }

  fetchUserList()
  {

    let loader = this.loadingCtrl.create({

      content: "Loading ...",
      duration: 15000

    });

    let loadingSuccessful = false;//To know whether loading timeout happened or not

    loader.present().then(() => 
    {

      this.http.post(this.apiValues.baseURL + "/user_list", null, null) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          console.log(serverReply);
          loader.dismiss();

          if ('message' in serverReply) //incorrect login
          {


            const toast = this.toastCtrl.create({
              message: serverReply.message,
              duration: 5000
            });
            toast.present();
          }
          else
          {
            this.user_list = serverReply;
          }




        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            this.presentToast("Error in getting data ");
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentToast("Timeout!!! Server did not respond ");
      }
    });

  }

  presentToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });

    toast.present();
  }

  addUser(user: SingleUser)
  {

    console.log("Add user=" + user.name);
    this.selected_users.push(user);
    let index = this.user_list.findIndex(userInList => userInList.id == user.id);
    this.user_list.splice(index, 1); //Remove the selected client from client list
  }

  removeUser(index)
  {

    console.log("remove user at=" + index);
    let user = this.selected_users[index];
    this.selected_users.splice(index, 1);
    this.user_list.push(user);
  }


  dismissPage()
  {
    this.navCtrl.pop();
  }

  sendEmail()
  {
    let loader = this.loadingCtrl.create({

      content: "Sending ...",
      duration: 15000

    });

    let loadingSuccessful = false;//To know whether loading timeout happened or not

    let body = new FormData();
    body.append('cid', String(this.passed_client.id));
    body.append('subject', String(this.subject));
    body.append('body', String(this.email_body));
    body.append('session_id', String(this.loggedInUser.id));
    body.append('to_user', this.getSelectedUsersParameters());
    
    console.log(this.getSelectedUsersParameters());
    console.log(body);
    loader.present().then(() => 
    {

      this.http.post(this.apiValues.baseURL + "/send_secure_mail.php", body, null) //Http request returns an observable

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

              if ('message' in serverReply) //incorrect login
              {
                this.presentToast(serverReply.message);
              }
              else
              {
                this.presentToast("Failed to send Email!!! ");
              }
            }
            catch (err)
            {
              this.presentToast("Failed to send Email!!! ");
            }


          }
          else
          {
            this.presentToast("Failed to send Email!!! ");
          }
  
        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            this.presentToast("Error in sending email ");
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentToast("Timeout!!! Server did not respond ");
      }
    });

  }

  getSelectedUsersParameters():string
  {
    let param: string = '';
    for (let i = 0; i < this.selected_users.length; i++)
    {

      param = param + this.selected_users[i].id;

      if (i < this.selected_users.length - 1)
      {
        param = param +","
      }

    }

    return param;
  }



}
