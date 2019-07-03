import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";
import { LoginPage } from '../../login/login';
import { Storage } from '@ionic/storage';

import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../providers/my-storage/my-storage';

import {User } from '../../../models/login_user.model';

@Component({
	selector: 'edit_profile',
	templateUrl:'edit_profile.html'
})

export class EditProfilePage 
{
	u_id=null;
	USER_ID="id";
  users: any;

  loggedInUser: User;

  constructor(public myStorage: MyStorageProvider, public apiValue: ApiValuesProvider, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: Http, public loading: LoadingController, public toastCtrl: ToastController, public storage: Storage, public menuCtrl: MenuController) 
	{

		this.getUserId(); //We will fetch the user id from local storage which we saved at the time of login
        
    }
    
    fetchData()
    {
    	 console.log("User ID is="+this.u_id);
    		if(this.u_id!=null)
    		{
    				//This means that the user_id was fetched successfully
			console.log("User id not null");

		this.users=[];
		var headers = new Headers();
		headers.append("Accept", "application/json");
		headers.append("Content-Type", "application/json" );

		 let data = {

           mode:'view',

           session_user_id: this.u_id

         };
		
         /*
		let body = new FormData();
		body.append("mode","view");
		body.append("session_user_id",this.u_id);
		*/

       let options = new RequestOptions({ headers: headers });

  

		let loader = this.loading.create({

          content: "Loading ...",

		 });

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/profile",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   			console.log(serverReply);
		   			loader.dismiss();

		   			if("message" in serverReply)
		   			{
		   				const toast = this.toastCtrl.create({
							  message: serverReply.message,
							  duration: 3000
							});
							toast.present();	
			      
		   			}
		   			

			   });

  		 });
    		}
    		else
    		{

    			//If user id cannot be loaded from the local storage, then we cannot view profile
    			const toast = this.toastCtrl.create({
							  message: 'User not found. Please Login again',
							  duration: 3000
							});
							toast.present();	

				this.navCtrl.setRoot(LoginPage); //Take user to the login page
    		}	
    }

    getUserId()
    {
      this.loggedInUser = this.myStorage.getParameters();
      this.users = [this.loggedInUser];
    }

  goBack()
  {
    this.navCtrl.pop();
  }
}
