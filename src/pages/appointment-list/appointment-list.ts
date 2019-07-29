import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, ToastController } from 'ionic-angular';

import { User } from '../../models/login_user.model';
import { Client } from '../../models/client.model';

import { MyStorageProvider } from '../../providers/my-storage/my-storage';
import { ApiValuesProvider } from '../../providers/api-values/api-values';

import { BookAppointmentPage } from '../../pages/book-appointment/book-appointment';
import { SingleClientPage } from '../../pages/client_list/single_client/single_client';

@IonicPage()
@Component({
  selector: 'page-appointment-list',
  templateUrl: 'appointment-list.html',
})
export class AppointmentListPage
{
  advocate_list: any=[];
  appointment_list:any=[];
  visibility: boolean[] = [];

  loggedInUser: User;

  from_date: string = '';
  to_date: string = '';
  search_string: string = '';
  case_manager= '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myStorage: MyStorageProvider,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public http: Http,
    public events:Events,
    public apiValue: ApiValuesProvider)
  {
    this.loggedInUser = this.myStorage.getParameters();
    this.getCaseManagerList();

     //-----------Hardcoding access for Case Manger so that they cannot see appointments of other case managers---//
    if (this.loggedInUser != undefined && Number(this.loggedInUser.user_type_id) == 4)
    {
      this.case_manager = this.loggedInUser.id; //If the logged in user is an advocate, then his id will be same as logged-in id
    }

    this.fetchData();
  }

  ionViewDidLoad()
  {
    console.log('ionViewDidLoad AppointmentListPage');
  }

  ionViewDidEnter()
  {
    if(this.navParams.data.reload)
    {
      this.fetchData();
    }
  }

  searchClient()
  {
    this.events.publish('mainSearch', 'ds'); //This event is defined in app.component.ts file
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

  fetchData()
  {

    var headers = new Headers();
    this.appointment_list = [];
    this.visibility = [];

    headers.append("Accept", "application/json");

    headers.append("Content-Type", "application/json");

    let options = new RequestOptions({ headers: headers });
    let body = new FormData();

    body.set('session_id', this.loggedInUser.id);
    body.set('user_type_id', this.loggedInUser.user_type_id);
    body.set('from_date', this.from_date);
    body.set('to_date', this.to_date);
    body.set('search_string', this.search_string);
    body.set('a_advocate', this.case_manager);

    console.log('Selected Case Manger' + this.case_manager);
    console.log('Search String' + this.search_string);
    console.log('From Date' + this.from_date);
    console.log('To Date' + this.to_date);


    let loader = this.loading.create({

      content: "Loading ...",
      duration: 15000

    });
    let loadingSuccessful = false;//To know whether timeout occured or not
    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/appointment_list.php", body, null) //Http request returns an observable

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
            this.appointment_list = serverReply;
            for (let i = 0; i < this.appointment_list.length; i++)
            {
              this.visibility[i] = false;
            }
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

  bookAppointment()
  {
    this.navCtrl.push(BookAppointmentPage);
  }

  showDetails(appointment, $event, i)
  {
    this.visibility[i] = !this.visibility[i];
  }

  viewClient(appointment)
  {
    
    let client: Client = new Client();
    client.id = appointment.ref_id;
    //Currently harcoding access right to a usertype= Client
    if (Number(this.loggedInUser.user_type_id) == 5)
    {
      client.id = Number(this.loggedInUser.id); //Client can only view his profile
    }
    
   
    let data =
    {
      clientPassed: client
    }
    this.navCtrl.push(SingleClientPage,data);
  }

}
