import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, NavController } from 'ionic-angular';
import { LoadingController, ToastController, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Client } from '../../models/client.model';
import { User } from '../../models/login_user.model';
import { DatewiseHearing } from '../../models/client_hearing.model';
import { Convert24HourTimePipe } from '../../pipes/convert24-hour-time/convert24-hour-time';
import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';

@Component({
  selector: 'add-client-hearing',
  templateUrl: 'add-client-hearing.html'
})
export class AddClientHearingComponent
{

  passedClient: Client;
  loggedInUser: User;

  addHearingForm: FormGroup;

  constructor
    (
      public navParams: NavParams,
      public alertCtrl: AlertController,
      public formBuilder: FormBuilder,
      public navCtrl: NavController,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public apiValues: ApiValuesProvider,
      public myStorage: MyStorageProvider,
      public viewCtrl: ViewController,
    public http: Http,
    public convertTimePipe: Convert24HourTimePipe
    )
  {
    console.log('Hello AddClientHearingComponent Component');

    this.loggedInUser = this.myStorage.getParameters();
    this.addHearingForm = this.formBuilder.group(
      {
        date: new FormControl('', Validators.compose([Validators.required])),
        time: new FormControl('', Validators.compose([Validators.required])),
        judge_name: new FormControl('', Validators.compose([Validators.required])),
        location: new FormControl('', Validators.compose([Validators.required])),
        call_up: new FormControl(''),
        type: new FormControl(''),
       
      });
  }

  ionViewDidLoad()
  {
    this.passedClient = this.navParams.get('client');
  }

  dismissPage()
  {
    this.navCtrl.pop();
  }

  add()
  {


    if (!this.addHearingForm.valid)
    {
      const alert = this.alertCtrl.create(
        {
          title: 'Attention!',
          message: 'Some values are empty or incorrect',
          buttons: ["Ok"]

        });
      alert.present();
      return;
    }

    //Following will execute if the form is valid

    let loader = this.loadingCtrl.create({

      content: "Adding...",
      duration: 15000

    });

    let loadingSuccessful = false;//To know whether loading timeout happened or not

   // http://myamenbizzapp.com/dsd/api_work/add_hearing_details.php?hearing_date=14-07-2019
    //& hearing_time=11: 30 & TypeofHearing=interview
    //& judgeName=ram pal singh & locationOfHearing=delhi high court & callUp=test call up
    //& cid=83 & session_id=1

    console.log('--Time Selected--');
    console.log(this.addHearingForm.value.time);
    this.addHearingForm.controls.time.setValue(this.convertTimePipe.transform(this.addHearingForm.value.time));
    console.log('--Time Converted--');
    console.log(this.addHearingForm.value.time);
    let body = new FormData();
    body.set('hearing_date', this.addHearingForm.value.date);
    body.set('hearing_time', this.addHearingForm.value.time);
    body.set('TypeofHearing', this.addHearingForm.value.type);
    body.set('judgeName', this.addHearingForm.value.judge_name);
    body.set('locationOfHearing', this.addHearingForm.value.location);
    body.set('callUp', this.addHearingForm.value.call_up);
    body.set('cid', String(this.passedClient.id));
    body.set('session_id', this.loggedInUser.id);
   
    console.log(body);
    loader.present().then(() => 
    {

      this.http.post(this.apiValues.baseURL + "/add_hearing_details.php", body, null) //Http request returns an observable

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
                  this.navCtrl.pop();
                }
              }
              else
              {
                this.presentToast("Failed to add hearing!!! ");
              }
            }
            catch (err)
            {
              this.presentToast("Failed to add hearing!!! ");
            }


          }
          else
          {
            this.presentToast("Failed to add hearing!!!");
          }

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            this.presentToast("Error in adding hearing ");
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
