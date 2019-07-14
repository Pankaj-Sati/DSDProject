import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, ToastController, LoadingController } from 'ionic-angular';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { User } from '../../../../models/login_user.model';

@Component({
  selector: 'send_sms',
  templateUrl:'send_sms.html'
})
export class SendSMSPage
{
  contactNo='';
  message = '';
  clientId = '';
  maxCharacters = 200; //maximum length of the SMS

  loggedInUser: User;

  
  constructor
    (public navParams: NavParams,
    public apiValues: ApiValuesProvider,
    public myStorage: MyStorageProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public http: Http
    )
  {
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad()
  {
    //Called after the view has been loaded. Safe to get parameters

    console.log('In Ion VIew Did Load');
    this.contactNo = this.navParams.get('contact');
    console.log(this.contactNo);
    this.clientId = this.navParams.get('client_id');
  }

  sendSMS()
  {
    if (this.message == null || this.message.length == 0) {
      this.showToast('Text Message cannot be empty');
    }
    else
    {
      const loader = this.loadingCtrl.create({

        content: 'Sending...',
        duration:15000
      });
      let loadingSuccessful = false;//To know whether timeout occured or not

      loader.present().then(() => {

        let body = new FormData();
        body.append('smsContact', this.contactNo);
        body.append('smstext_msg', this.message);
        body.append('cid', this.clientId);
        body.append('session_id', this.loggedInUser.id);

        this.http.post(this.apiValues.baseURL + '/send_sms.php', body, null)
          .subscribe(response =>
          {
            console.log(response);
            loadingSuccessful = true;
            loader.dismiss();
            if (response) {
              try {
                let data = JSON.parse(response['_body']);
                if (('code' in data) && data.code > 400) {
                  //error
                  this.showToast(data.message);

                  return;
                }
                else {
                  //Success
                  this.showToast(data.message);

                  return;
                }
              }
              catch (err) {
                console.log(err);
                this.showToast('Failure!!!');
              }
            }
            else {

              this.showToast('Failure!!!');
            }

          }, error => {
            loadingSuccessful = true;
            console.log(error);
            loader.dismiss();
          });
      });

      loader.onDidDismiss(() => {

        if (!loadingSuccessful)
        {
          this.showToast('Failure!!! Server did not respond');
        }
      });

    }
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
