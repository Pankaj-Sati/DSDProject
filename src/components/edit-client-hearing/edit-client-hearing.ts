import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, NavController } from 'ionic-angular';
import { LoadingController, ToastController, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Client } from '../../models/client.model';
import { User } from '../../models/login_user.model';
import { DatewiseHearing } from '../../models/client_hearing.model';

import { Convert24HourTimePipe } from '../../pipes/convert24-hour-time/convert24-hour-time';
import { Convert12HourTo24Pipe } from '../../pipes/convert12-hour-to24/convert12-hour-to24';
import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';

@Component({
  selector: 'edit-client-hearing',
  templateUrl: 'edit-client-hearing.html'
})
export class EditClientHearingComponent
{

  passedClient: Client;
  loggedInUser: User;
  passedHearing: DatewiseHearing;

  editHearingForm: FormGroup;

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
    public convertTimePipe: Convert12HourTo24Pipe,
    public convertTo12Hour: Convert24HourTimePipe
    )
  {
    console.log('Hello EditClientHearingComponent Component');
    this.loggedInUser = this.myStorage.getParameters();
    this.editHearingForm = this.formBuilder.group(
      {
        date: new FormControl('', Validators.compose([Validators.required])),
        time: new FormControl('', Validators.compose([Validators.required])),
        judge_name: new FormControl('', Validators.compose([Validators.required])),
        location: new FormControl('', Validators.compose([Validators.required])),
        call_up: new FormControl(''),
        type: new FormControl(''),
        description: new FormControl('', Validators.compose([Validators.required])),
        stage: new FormControl('', Validators.compose([Validators.required])),
        notes: new FormControl(''),
      });
  }

  ionViewDidLoad()
  {
    this.passedClient = this.navParams.get('client');
   
    this.passedHearing = this.navParams.get('hearing');
    console.log(this.passedHearing);
    this.changeFormValues();
  }

  dismissPage()
  {
    this.navCtrl.pop();
  }

  changeFormValues()
  {
    this.editHearingForm.controls.date.setValue(this.passedHearing.hearing_date);
    this.editHearingForm.controls.time.setValue(this.convertTimePipe.transform(this.passedHearing.hearing_time));
    this.editHearingForm.controls.judge_name.setValue(this.passedHearing.judgeName);
    this.editHearingForm.controls.location.setValue(this.passedHearing.locationOfHearing);
    this.editHearingForm.controls.call_up.setValue(this.passedHearing.callUp);
    this.editHearingForm.controls.type.setValue(this.passedHearing.TypeofHearing);
    this.editHearingForm.controls.description.setValue(this.passedHearing.hearing_disc);
    this.editHearingForm.controls.stage.setValue(this.passedHearing.hearing_stage);
    //Add for notes
  }

  update()
  {
    

    if (!this.editHearingForm.valid)
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

      content: "Updating...",
      duration: 15000

    });

    let loadingSuccessful = false;//To know whether loading timeout happened or not

    //http://myamenbizzapp.com/dsd/api_work/edit_hearing_details.php?hearing_date=14-07-2019
    //& hearing_time=11: 30 & TypeofHearing=interview & judgeName=ram pal singh
    //& locationOfHearing=delhi high court & callUp=test call up & cid=83 & session_id=1
    //& stage=inicial & description=test & hear_notes=test notes
    //& hearing_file=test.jpg & hearing_rowId=49

    let body = new FormData();
    body.set('hearing_date', this.editHearingForm.value.date);
    body.set('hearing_time', this.convertTo12Hour.transform(this.editHearingForm.value.time));
    body.set('TypeofHearing', this.editHearingForm.value.type);
    body.set('judgeName', this.editHearingForm.value.judge_name);
    body.set('locationOfHearing', this.editHearingForm.value.location);
    body.set('callUp', this.editHearingForm.value.call_up);
    body.set('cid', String(this.passedClient.id));
    body.set('session_id', this.loggedInUser.id);
    body.set('stage', this.editHearingForm.value.stage);
    body.set('description', this.editHearingForm.value.description);
    body.set('hear_notes', this.editHearingForm.value.notes);
    body.set('hearing_file', this.passedHearing.upload_doc);
    body.set('hearing_rowId', this.passedHearing.id);

    console.log(body);
    loader.present().then(() => 
    {

      this.http.post(this.apiValues.baseURL + "/edit_hearing_details.php", body, null) //Http request returns an observable

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
                this.presentToast("Failed to edit hearing!!! ");
              }
            }
            catch (err)
            {
              this.presentToast("Failed to edit hearing!!! ");
            }


          }
          else
          {
            this.presentToast("Failed to edit hearing!!!");
          }

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            this.presentToast("Error in editing hearing ");
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
