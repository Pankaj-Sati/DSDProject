import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";

import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';

import {User } from '../../models/login_user.model';

import { Events } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})



export class LoginPage 
{
  U_ID="id";
	U_NAME="name";
	U_EMAIL="email";
	U_USERTYPEID="usertype_id";
	U_PROFILEIMG="profile_img";

	isCorrectUser:boolean=true;
	isCorrectPass:boolean=true;

	login_username:string;
	login_password:string;
	result:string;

  constructor(public myStorage: MyStorageProvider, public apiValue: ApiValuesProvider, public events: Events, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: Http, public loading: LoadingController, public toastCtrl: ToastController, public storage: Storage, public menuCtrl: MenuController) 
	{

		this.menuCtrl.enable(false);
		this.menuCtrl.swipeEnable(false);
		this.checkIfAlreadyLoggedIn();
    }
	
	checkIfAlreadyLoggedIn()
	{
		var userID=99;
			console.log(userID);
		this.storage.get(this.U_ID).then((value) => {
			console.log('Gettingg value: '+value);
		  
			if(value !=null && value.length>0)
			  {
				  //User already exists, take him to deskboard
				  const toast = this.toastCtrl.create({
							  message: 'Login successfull',
							  duration: 3000
							});
							toast.present();

				  this.navCtrl.setRoot(DashboardPage);
				  
			  }
		});
			
		
		  
	
	}
	
	submitData()
	{
		 /*this.http.get("http://jagdambasoftwaresolutions.com/dsd/api_work/reminders")
			 .map(response => response.json())
			 .subscribe(serverReply => {
			 console.log(serverReply);
		 });
		
		
		  
		  */
		
		console.log("User="+this.login_username);

    if(this.login_username==null || this.login_username.length==0 )
	 {

		let alert = this.alertCtrl.create({

		 title:"ATTENTION",

     message: "Username field is empty",

		buttons: ["OK"]

		});

		alert.present();
		this.isCorrectUser=false;

     } 
		else

    if(this.login_password==null ||this.login_password.length==0)
	{

		  let alert = this.alertCtrl.create({

		title:"ATTENTION",

    message: "Password field is empty",

		buttons: ["OK"]

		});

		alert.present();
		this.isCorrectPass=false;

	}

    else

    {

   	   var headers = new Headers();

       headers.append("Accept", "application/json");

       headers.append("Content-Type", "application/json" );

       let options = new RequestOptions({ headers: headers });

  

       let data = {

           username: this.login_username,

           password: this.login_password  

         };

		let loader = this.loading.create({

		   content: "Loging in please wait…",
		   duration: 10000

		 });

		let loadingSuccessful=false; //To know whether timeout occured

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/login.php",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
				loadingSuccessful=true;
				loader.dismiss()
				
				console.log(serverReply);
			 	if('message' in serverReply) //incorrect login
					{
						this.result=serverReply.message;
						
						const toast = this.toastCtrl.create({
							  message: 'Login failed',
							  duration: 3000
							});
							toast.present();
							this.isCorrectPass=false;
							this.isCorrectUser=false;
					}
			 
			 	else if('name' in serverReply) //Correct login
					{
						const toast = this.toastCtrl.create({
							  message: 'Login successfull',
							  duration: 3000
							});
							toast.present();

							this.isCorrectPass=true;
							this.isCorrectUser=true;
						
						//Now we will save the user details
						
            let user: User=new User();

           user.id = serverReply.id;
           user.name = serverReply.name;
           user.email = serverReply.email;
           user.id = serverReply.usertype_id;
           user.profile_img = serverReply.profile_img;

           this.myStorage.setParameters(user);

				  	console.log('Data set');

					this.navCtrl.setRoot(DashboardPage);
					}
			 
			   }, error=>{

			   	console.log(error);
			   	loadingSuccessful=false;
			   	loader.dismiss();
			   });

  		 });

	   loader.onDidDismiss(()=>{

	   	if(! loadingSuccessful)
	   	{
	   		const toast = this.toastCtrl.create({
							  message: 'Login failed. Server did not respond',
							  duration: 5000
							});
			 toast.present();
	   	}

	   });
		

    }
  }
}

