import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';

import { RemindersPage } from '../reminders/reminders';
import { NotificationsPage } from '../notifications/notifications';
import { AddClientPage } from '../client_list/add_client/add_client';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import {Events} from 'ionic-angular'

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';

import {User } from '../../models/login_user.model';

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
	showSearch:boolean;

  constructor(public myStorage: MyStorageProvider, public apiValue: ApiValuesProvider, public events: Events, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: Http, public loading: LoadingController, public storage: Storage, public toastCtrl: ToastController)
	{
		this.menuCtrl.enable(true);
		this.menuCtrl.swipeEnable(true);
			
        this.checkIfAlreadyLoggedIn();
        this.showSearch=false;
        this.events.publish('loggedIn');
        this.events.publish('newPage','DSD Test1');
    }
	
	checkIfAlreadyLoggedIn()
	{

      this.loggedInUser = this.myStorage.getParameters();

      if (this.loggedInUser != null && this.loggedInUser.id.length > 0)
			{
				  //User already exists, fetch data

				 this.fetchData();
				  
			  }
		  else
			{
				this.navCtrl.setRoot(LoginPage);
			}
				
		  
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

	
	openRemindersList()
	{
		this.navCtrl.push(RemindersPage);
	}
	
	openNotificationsList()
	{
		this.navCtrl.push(NotificationsPage);
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
	  console.log("Fetching Data");

       headers.append("Accept", "application/json");

       headers.append("Content-Type", "application/json" );

       let options = new RequestOptions({ headers: headers });

  
		let loader = this.loading.create({

		   content: "Fetching data. Please wait…",
		   duration:15000

		 });

		let loadingSuccessful=false;//To know whether loader ended due to timeout

		 let data = { //Data to be sent to the server

         };
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
						if('code' in serverReply)
						{
							//This means error
							this.total_clients=String(0);
						}
						else
						{
							this.total_clients=serverReply.totalClient;
						}
						
						loader.dismiss();
						


				   },error=>{
			   		loadingSuccessful=true;
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

	
   
}
