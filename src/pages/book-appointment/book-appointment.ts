import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DatePipe } from '@angular/common';

import { User } from '../../models/login_user.model';

import { Convert24HourTimePipe } from '../../pipes/convert24-hour-time/convert24-hour-time';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';
import { ApiValuesProvider } from '../../providers/api-values/api-values';



@IonicPage()
@Component({
  selector: 'page-book-appointment',
  templateUrl: 'book-appointment.html',
})
export class BookAppointmentPage
{
  loggedInUser: User;

  a_description: string = '';
  a_time: string = '';
  a_date: string = '';
  a_advocate: string = '';

  advocate_list: any;
  maxDate: any;
  minDate: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myStorage: MyStorageProvider,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public http: Http,
    public apiValue: ApiValuesProvider,
    public alertCtrl: AlertController,
    public convert24To12: Convert24HourTimePipe
  
  )
  {
    
    this.minDate = new Date().toISOString();
    this.loggedInUser = this.myStorage.getParameters();
    this.getCaseManagerList();
  }

  ionViewDidLoad()
  {
    console.log('ionViewDidLoad BookAppointmentPage');
  }

  bookAppointment()
  {
    if(this.a_date.length == 0)
    {
      this.showToast('Appointment date cannot be empty');
      return;
    }

    if (this.a_time.length == 0)
    {
      this.showToast('Appointment time cannot be empty');
      return;
    }


    if (this.a_advocate.length == 0)
    {
      this.showToast('Case Manager cannot be empty');
      return;
    }

    if (this.dateChanged()==false) //Check whether the date is in business days or not
    {
      return; //Stop further execution
    }
    //Following lines will execute only if everything is okay

    const loader = this.loading.create({
      content: 'Booking...',
      duration:15000
    });
    let loadingSuccessfull = false;//To know whether timeout occured or not

    loader.present();

    let body = new FormData();

    body.set('session_id', this.loggedInUser.id);
    body.set('a_date', this.a_date);
    body.set('a_time', this.convert24To12.transform(this.a_time));
    body.set('a_remark', this.a_description);

    //Splitting name
    let firstname = String(this.loggedInUser.name).substring(0,this.loggedInUser.name.lastIndexOf(' '));
    let lastname = String(this.loggedInUser.name).substring(this.loggedInUser.name.lastIndexOf(' '));
    body.set('first_name', firstname);
    body.set('last_name', lastname);

    body.set('contact', this.loggedInUser.contact);
    body.set('a_advocate', this.a_advocate);

    console.log(this.loggedInUser);

    this.http.post(this.apiValue.baseURL + '/book_appointment.php', body, null)
      .subscribe(response =>
      {
        console.log(response);
        loadingSuccessfull = true;
        loader.dismiss();

        if (response)
        {
          try
          {
            let data = JSON.parse(response['_body']);
            if ('code' in data && data.code == 200)
            {
              //Success
              this.showToast(data.message);
              this.navCtrl.getPrevious().data.reload = true;
              this.navCtrl.pop();
            }
            else
            {
              //Failure
              this.showToast(data.message);
            }
          }
          catch (err)
          {
            console.log(err);
            this.showToast('Error in response');
          }
        }
        else
        {
          this.showToast('Error in response');
        }
      }, error =>
        {
          console.log(error);
          loadingSuccessfull = true;
          this.showToast('Failed to book appointment');
          loader.dismiss();
        });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessfull)
      {
        this.showToast('Timeout!!! Server did not respond');
      }
    });

  }

  goBack()
  {
    this.navCtrl.pop();
  }

  getCaseManagerList()
  {
    this.advocate_list = [];

    var headers = new Headers();

    headers.append("Accept", "application/json");

    headers.append("Content-Type", "application/json");

    let options = new RequestOptions({ headers: headers });

    let data =
    {

    };
    let loader = this.loading.create({

      content: "Loading…",

    });

    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/get_advocate.php", data, options) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          console.log(serverReply);
          this.advocate_list = serverReply;
          loader.dismiss();

        });

    });
  }

  showToast(msg)
  {
    const toast = this.toastCtrl.create(
    {
      message: msg,
      duration:3000
    });
    toast.present();
  }

  dateChanged()
  {
    let dateSelected = this.a_date;
    console.log('Changed Date:' + dateSelected);
    let pipe = new DatePipe('en-US');
    dateSelected = pipe.transform(dateSelected, 'EEEE');
    console.log('Formatted Date:' + dateSelected);
    if (dateSelected != undefined && (String(dateSelected).toLowerCase() == 'saturday' || String(dateSelected).toLowerCase() == 'sunday'))
    {
      //Weekends selected
      this.presentAlert('Please Select Business Days \n Monday to Friday (9 AM to 5 PM)');
      return false;
    }
    return true;
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

}
