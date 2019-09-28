import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ReminderListPage } from '../reminders/new_format/reminder_list/reminder_list';
import { NotificationListPage } from '../notifications/new_format/notification_list/notification_list';
import { AddClientPage } from '../client_list/add_client/add_client';
import { BookAppointmentPage } from '../book-appointment/book-appointment';
import { ClientDocumentsPage } from '../client_list/single_client/document/document';
import { AppointmentListPage } from '../appointment-list/appointment-list';

import { LoginPage } from '../login/login';
import { FrontPage } from '../front/front';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import {Events} from 'ionic-angular'

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';

import {User } from '../../models/login_user.model';
import { MediaPage } from '../media/media';
import { ContactUsPage } from '../contact-us/contact-us';



@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage 
{
  loggedInUser: User;
	total_reminders:string;
	total_notifications:string;
	total_clients:string;
	total_appointments:string;
  showSearch: boolean;
  calendarLink: SafeResourceUrl;


  constructor(public myStorage: MyStorageProvider,
    public apiValue: ApiValuesProvider,
    public events: Events,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public storage: Storage,
    public toastCtrl: ToastController,
    public sanitizer: DomSanitizer,
    public inAppBrowser: InAppBrowser,
  )
  {

   
		this.menuCtrl.enable(true);
    this.menuCtrl.swipeEnable(true);

    this.loggedInUser = this.myStorage.getParameters();

    this.showSearch=false;
    this.events.publish('loggedIn');
    this.events.publish('newPage', 'DSD Test1');

    console.log('----IFrame Link-------');
    if ((Number(this.loggedInUser.user_type_id) == 4 || Number(this.loggedInUser.user_type_id) == 7 ) && this.loggedInUser.calendar_link != undefined)
    {
      
      this.calendarLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.loggedInUser.calendar_link);
      console.log(this.calendarLink);
    }
    else
    {
     
      this.calendarLink = this.sanitizer.bypassSecurityTrustResourceUrl("https://teamup.com/ksqn86pa626r69dvzg");
      console.log(this.calendarLink);

    }
    

   
  }

	
	checkIfAlreadyLoggedIn()
	{
      if (this.loggedInUser != undefined && this.loggedInUser.id.length > 0)
			{
				  //User already exists, fetch data

				 this.fetchData();
				  
			}
		  else
			{
        this.navCtrl.setRoot(FrontPage);
			}
				
		  
	}

  ionViewDidEnter()
  {
    this.checkIfAlreadyLoggedIn();
  }

	setData()
	{
		this.storage.set("myKey","hello");
		console.log('Data set');
	}

	getData()
	{
		this.storage.get('myKey').then((val) => {
			console.log('Your value is', val);
		  });
	}

  bookAppointment()
  {
    this.navCtrl.push(BookAppointmentPage);
  }
	openRemindersList()
	{
		this.navCtrl.push(ReminderListPage);
	}
	
	openNotificationsList()
	{
		this.navCtrl.push(NotificationListPage);
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}

	
	addClient()
	{
		this.navCtrl.push(AddClientPage);
	}


	fetchData()
	{
	
	   var headers = new Headers();
      console.log("Loading ...");

       let options = new RequestOptions({ headers: headers });

  
		let loader = this.loading.create({

		   content: "Loading...",
		   duration:15000

		 });

		let loadingSuccessful=false;//To know whether loader ended due to timeout

      let data = new FormData();
      data.set('session_id', this.loggedInUser.id);
      data.set('user_type_id', this.loggedInUser.user_type_id);

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/get_totalreminder",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
					loadingSuccessful=true;
		   			console.log(serverReply);
		   			
		   			this.total_reminders=serverReply.totalReminder;
			      

			   },error=>{
			   		loadingSuccessful=true;
			   });
		   
		   this.http.post(this.apiValue.baseURL+"/get_totalnotification",data,options) //Http request returns an observable
		   .map(response => response.json()) ////To make it easy to read from observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

				{ 
						loadingSuccessful=true;
						console.log(serverReply);
						
						this.total_notifications=serverReply.totalNotification;


				   },error=>{
			   		loadingSuccessful=true;
			   });

		   this.http.post(this.apiValue.baseURL+"/get_totalclient",data,options) //Http request returns an observable

		   .map(response => response.json()) ////To make it easy to read from observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

				{ 
						loadingSuccessful=true;
						console.log(serverReply);
						if(! serverReply)
						{
							//This means error
							this.total_clients=String(0);
						}
						else
						{
							this.total_clients=serverReply;
						}
						

				   },error=>{
			   		loadingSuccessful=true;
             });

         //---------------------Get Total Appointments---------------//

         this.http.post(this.apiValue.baseURL + "/dashboard_get_totalAppointments.php", data, options) //Http request returns an observable

           .map(response => response.json()) ////To make it easy to read from observable

           .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

           {
             loadingSuccessful = true;
             console.log(serverReply);
             if (!serverReply)
             {
               //This means error
               this.total_appointments = String(0);
             }
             else
             {
               this.total_appointments = serverReply.totalAppointments;
             }

             loader.dismiss();



           }, error =>
           {
             loadingSuccessful = true;
           });
		   
       });



	   loader.onDidDismiss(()=>{

		   	if(! loadingSuccessful)
		   	{
		   		const toast=this.toastCtrl.create({
		   			message:'Server Connection Error!',
		   			duration:3000
		   		});
		   		toast.present();
		   	}

	   });
		

    }

  documentsList()
  {
    let data =
    {
      client_id: this.loggedInUser.id,
      client_name: this.loggedInUser.name
    };
    this.navCtrl.push(ClientDocumentsPage, data);
    return;
  }

  viewAppointments()
  {
    this.navCtrl.push(AppointmentListPage);
  }

  openWebsite()
  {
    let url = 'http://dsdlawfirm.com';
    this.inAppBrowser.create(url,'_system');
  }

  checkCaseStatus()
  {
    let url = ' https://egov.uscis.gov/casestatus/landing.do';
    this.inAppBrowser.create(url, '_system');
  }
   
}
