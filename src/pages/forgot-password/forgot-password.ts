import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Http} from '@angular/http';
import {ApiValuesProvider } from '../../providers/api-values/api-values';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage
{
  isCorrectContact: boolean = true;

  u_contact;

  result;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public apiValues: ApiValuesProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loading: LoadingController,
    public http: Http)
  {

  }

  ionViewDidLoad()
  {
    console.log('ionViewDidLoad ForgotPasswordPage');

  }

  goBack()
  {
    this.navCtrl.pop();
  }


  validateContact(): boolean
  {
    let contactValidator = /^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/;
    let result: boolean = contactValidator.test(String(this.u_contact));

    if (result)
    {
      this.isCorrectContact = true;
      return true;
    }
    else
    {
      this.isCorrectContact = false;
      return false;
    }

  }

  submitData()
  {
    this.result = '';
    if (this.u_contact == undefined || this.u_contact == null || this.u_contact.length == 0)
    {
      this.isCorrectContact = false;

      this.showAlert("Contact field is empty");

      return;
    }

    //Following lines will execute if the contact field is entered
    let contactValidator = /^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/;

    if (!this.validateContact())
    {
      //Invalid contact number
      this.isCorrectContact = false;
      this.showAlert("Contact is invalid");
      return;
    }

     //Following lines will execute if the contact field is correct
    const loader = this.loading.create({

      content: 'Loading...',
      duration: 15000
    });
    let loadingSuccessful = false;//To know whether timeout occured or not

    loader.present().then(() =>
    {

      let body = new FormData();

      body.set('contact', String(this.u_contact).replace(/\D+/g,''));
      

      this.http.post(this.apiValues.baseURL + '/forget_password.php', body, null)
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
              if (('code' in data) && data.code == 200)
              {
                //Success
                
                this.showToast(data.message);
                

                this.showAlert("We have sent your login details to your contact number" + this.u_contact);
                
                return;
              }
              else
              {
              
                //error
                this.showToast(data.message);
                this.result = data.message;

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

  showToast(msg)
  {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  showAlert(msg)
  {
    let alert = this.alertCtrl.create({

      title: "ATTENTION",

      message: msg,

      buttons: ["OK"]

    });

    alert.present();
  }

}
