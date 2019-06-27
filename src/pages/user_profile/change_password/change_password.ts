import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";
import { Storage } from '@ionic/storage';

import {ApiValuesProvider} from '../../../providers/api-values/api-values';

@Component({
	selector: 'change_password',
	templateUrl:'change_password.html'
})

export class ChangePasswordPage 
{
	u_id=null;
	USER_ID="id";
	current_pass:string;
	new_pass:string;
	confirm_pass:string;
	passed_image:string;

	constructor(public apiValue:ApiValuesProvider,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController,public storage: Storage, public menuCtrl: MenuController) 
	{
			this.storage.get(this.USER_ID).then((value) => 
			  {
					
				  this.u_id=value;
		  		  
			  });
	  
	}

	ionViewDidLoad()
    {
    		//This method is called when the page loads for the first time
    		this.passed_image=this.navParams.get('image');

    }
	changePassword()
	{

		if(this.u_id==null)
		{
			const toast = this.toastCtrl.create({
							  message: 'Error in user ID',
							  duration: 3000
							});
							toast.present();	
		}
		else
		{

			//Checking if the password fields are set or not

			if(this.current_pass==null || this.current_pass.length==0 ||
			 this.new_pass==null || this.new_pass.length==0 ||
			 this.confirm_pass==null || this.confirm_pass.length==0)
			 {

				let alert = this.alertCtrl.create({

				 title:"ATTENTION",

				subTitle:"Password fields cannot be empty",

				buttons: ["OK"]

				});

				alert.present();

		     } 
		     else if(this.confirm_pass!=this.new_pass)
		     {
		     	let alert = this.alertCtrl.create({

				 title:"ATTENTION",

				subTitle:"New Password donot match with Confirm Password",

				buttons: ["OK"]

				});

				alert.present();
		     }
		     else
		     {
		     	var headers = new Headers();
		     	headers.append("Accept", "application/json");

       			headers.append("Content-Type", "application/json" );

       			/*
				let body = new FormData();
				body.append("current_pass",this.current_pass);
				body.append("new_pass",this.new_pass);
				body.append("confirm_pass",this.confirm_pass);
				body.append("session_user_id",this.u_id);
				*/

				let data = { //Data to be sent to the server

		           current_pass:this.current_pass,
				   new_pass:this.new_pass,
				   confirm_pass:this.confirm_pass,
				   session_user_id:this.u_id
		         };

		       let options = new RequestOptions({ headers: headers });

		  

				let loader = this.loading.create({

				   content: "Requesting change please wait…",

				 });

			   loader.present().then(() => 
				{

			   this.http.post(this.apiValue.baseURL+"/password_changed.php",data,options) //Http request returns an observable

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

			
		}
	}
}