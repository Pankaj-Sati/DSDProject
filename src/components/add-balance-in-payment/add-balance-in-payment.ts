import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, NavController, Platform } from 'ionic-angular';
import { LoadingController, ToastController, ViewController } from 'ionic-angular';

import { User } from '../../models/login_user.model';

import { ClientDetails, Client } from '../../models/client.model';


import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';


@Component({
  selector: 'add-balance-in-payment',
  templateUrl: 'add-balance-in-payment.html'
})
export class AddBalanceInPaymentComponent
{
  passedClientDetails: ClientDetails;
  passedClientID;
  loggedInUser: User;

  amount;
  remarks;

  constructor
    (
      public navParams: NavParams,
      public navCtrl: NavController,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public apiValues: ApiValuesProvider,
    public myStorage: MyStorageProvider,
    public viewCtrl: ViewController,
    public http: Http,
    public platform: Platform
  )
  {
    console.log('Hello AddBalanceInPaymentComponent Component');
    this.loggedInUser = this.myStorage.getParameters();

    this.platform.ready().then(() =>
    {
      //When the platform becomes available

      this.platform.registerBackButtonAction(() =>
      {
        this.dismissPage();
      });
    });
    
  }

  //http://myamenbizzapp.com/dsd/api_work/add_balance.php?cid=83&bAmount=2000
  //& balanceRemark=Test App API Balance & session_id=1


  ionViewDidLoad()
  {
    this.passedClientID = this.navParams.get('clientID');
    this.passedClientDetails = this.navParams.get('clientDetails');
  }

  dismissPage()
  {
    this.navCtrl.pop();
  }

  addBalance()
  {
    let loader = this.loadingCtrl.create({

      content: "Adding...",
      duration: 15000

    });

    let loadingSuccessful = false;//To know whether loading timeout happened or not

    let body = new FormData();
    body.append('cid', String(this.passedClientID));
    body.append('session_id', String(this.loggedInUser.id));
    body.append('bAmount', this.amount);
    body.append('balanceRemark', this.remarks);

    console.log(body);
    loader.present().then(() => 
    {

      this.http.post(this.apiValues.baseURL + "/add_balance.php?", body, null) //Http request returns an observable

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

                if (serverReply.code == 200)
                {
                  //Success
                  this.viewCtrl.dismiss();
                }
              }
              else
              {
                this.presentToast("Failed to add balance!!! ");
              }
            }
            catch (err)
            {
              this.presentToast("Failed to add balance!!! ");
            }


          }
          else
          {
            this.presentToast("Failed to add balance!!! ");
          }

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            this.presentToast("Error in adding balance ");
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

}
