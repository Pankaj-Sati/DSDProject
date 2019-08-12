import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";

import { ToastController } from 'ionic-angular';

import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-book-appointment-at-login',
  templateUrl: 'book-appointment-at-login.html',
})
export class BookAppointmentAtLoginPage
{
  userForm: FormGroup;
  maxDate: any;
  minDate: any;
  constructor(public platform: Platform,
    public formBuilder: FormBuilder,
    public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public events: Events)
  {
    this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString();
    this.minDate = new Date().toISOString();
    this.userForm = this.formBuilder.group({


      u_name: new FormControl('', Validators.compose([Validators.required])),
      u_lastname: new FormControl(''),
      u_date: new FormControl('', Validators.compose([Validators.required])),
      u_time: new FormControl('', Validators.compose([Validators.required])),
      u_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      u_email: new FormControl('', Validators.compose([Validators.pattern(/^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
      u_remark: new FormControl(''),
      

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookAppointmentAtLoginPage');
  }

  submitData()
  {

    //Validating data
    if (!this.userForm.valid)
    {
      this.presentAlert('Please fill all fields in the form');
      return;
    }

    //The following code will run only if the details entered are valid

    var headers = new Headers();
    let options = new RequestOptions({ headers: headers });

    let body = new FormData();
   
    //Details
    body.set("first_name", this.userForm.value.u_name);
    body.set("last_name", this.userForm.value.u_lastname);
    body.set("email", this.userForm.value.u_email);
    body.set("contact", String(this.userForm.value.u_contact).replace(/\D+/g, ''));

    console.log('Contact value Sent=' + String(this.userForm.value.u_contact).replace(/\D+/g, ''));

    body.set("a_date", this.userForm.value.u_date);
    body.set("a_time", this.userForm.value.u_time);
    body.set("a_remark", this.userForm.value.u_remark);

    let loader = this.loading.create({

      content: "Booking…",
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether timeout occured
    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/book_appointment.php", body, options) //Http request returns an observable
        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          loader.dismiss()

          console.log(serverReply);

          if (serverReply)
          {
            try
            {
              let response = JSON.parse(serverReply['_body']);

              

              if ('code' in response && response.code == 200) 
              {
                //Successfully booked appointment

                let pipe = new DatePipe('en-US');
                let appointmentDate = pipe.transform(this.userForm.value.u_date + " " + this.userForm.value.u_time,'MMM, dd yyyy HH:mm');

                this.presentAlert('Your appointment has been confirmed on date ' + appointmentDate);
                this.navCtrl.pop();
              }
              else
              {
                this.presentAlert(response.message);
              }


            }
            catch (err)
            {
              console.log(err);
              this.presentAlert('Failed!! Server returned an error');
            }
          }
          else
          {
            this.presentAlert('Failed!! Server returned an error');
          }

        }, error =>
          {
            loadingSuccessful = true;
            loader.dismiss();
            this.presentAlert('Failed to book appointment');
          });

    }, error =>
      {
        loadingSuccessful = true;
        loader.dismiss();
        this.presentAlert('Failed to book appointment');


      });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentAlert('Timeout!!! Server did not respond');
      }
    });
  }


  registerAppointmentInCalendar()
  {

    //Server should add appointment in calendar. But this function can be used to add it from here

    var headers: Headers = this.apiValue.calendarHeaders;

    let options = new RequestOptions({ headers: headers });

    let pipe = new DatePipe('en-US');
    let appointmentDate = pipe.transform(this.userForm.value.u_date + " " + this.userForm.value.u_time, 'MMM, dd yyyy HH:mm');

    let date = pipe.transform(this.userForm.value.u_date ,"MMM, dd yyyy");

    let appointmentContent = 'Client: '+this.userForm.value.u_name+' booked an appointment for today as a free consultation\n';
    appointmentContent += 'Date: ' + date +'\n';
    appointmentContent += 'Time(24 Hours): ' + this.userForm.value.u_time+'\n';
    appointmentContent += 'Contact No.: ' + this.userForm.value.u_contact+'\n';
    appointmentContent += 'Remark: ' + this.userForm.value.u_remark+'\n';

    console.log('Appointment Content=' + appointmentContent);

    let body = {

      "subcalendar_id": this.apiValue.MAIN_APPOINTMENT_CALANDER,
      "start_dt": this.userForm.value.u_date + "T" + this.userForm.value.u_time+":00",
      "end_dt": this.userForm.value.u_date + "T18:00:00",
          "all_day": false,
            "rrule": "",
              "title": "New Appointment",
            "who": this.userForm.value.u_name ,
                  "location": "USA",
      "notes": appointmentContent
    
    };

    console.log('body');
    console.log(body);

    let loader = this.loading.create({

      content: "Loading…",
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether timeout occured
    loader.present().then(() => 
    {

      this.http.post(this.apiValue.ADD_EVENT_URL, body, options) //Http request returns an observable
        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          loader.dismiss()

          console.log(serverReply);

        }, error =>
          {
            loadingSuccessful = true;
            loader.dismiss();
            
          });

    }, error =>
      {
        loadingSuccessful = true;
        loader.dismiss();
      });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentAlert('Timeout!!! Server did not respond');
      }
    });
  }

  presentAlert(text)
  {
    const alert = this.alertCtrl.create({
      message: text,
      title: 'Attention!',
      buttons: [{
        text: 'OK'
      }]
    });
    alert.present();
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
