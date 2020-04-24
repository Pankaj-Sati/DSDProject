import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";

import { MyStorageProvider } from '../../../providers/my-storage/my-storage';
import { User } from '../../../models/login_user.model';

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";

import {ApiValuesProvider} from '../../../providers/api-values/api-values';


@Component({
  selector: 'change_user_password',
  templateUrl: 'change_user_password.html'
})

export class ChangeUserPasswordPage
{

	passed_name:string;
	passed_uid:string;
	current_pass:string;
	new_pass:string;
  confirm_pass: string;
  loggedInUser: User;
  passwordInvalid: string = ''; //To show error message when password is invalid

  constructor(public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    public myStorage: MyStorageProvider
  ) 
  {
    this.loggedInUser = this.myStorage.getParameters();
	}

	ionViewDidLoad()
    {
    		//This method is called when the page loads for the first time
    		this.passed_name=this.navParams.get('name');
    		this.passed_uid=this.navParams.get('id');
    		console.log("Name/ID received="+this.passed_name+'/'+this.passed_uid);

    }

    changePassword()
	{

		if(this.passed_uid==null)
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
              this.passwordInvalid = "Password fields cannot be empty";
				alert.present();

		     } 
		     else if(this.confirm_pass!=this.new_pass)
		     {
		     	let alert = this.alertCtrl.create({

				 title:"ATTENTION",

				subTitle:"New Password donot match with Confirm Password",

				buttons: ["OK"]

                  });
              this.passwordInvalid = "New Password donot match with Confirm Password";
				alert.present();
            }
        else if (!this.confirm_pass.match(this.apiValue.PASSWORD_VALIDATOR))
        {
          let alert = this.alertCtrl.create({

            title: "ATTENTION",

            subTitle: "Password should be between 4 and 15 digits",

            buttons: ["OK"]

          });

          this.passwordInvalid = 'Password should be between 4 and 15 digits';
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

		           uid:this.passed_uid,
		           password:this.current_pass,
                  changepassword: this.new_pass,
                  session_user_id: this.loggedInUser.id
		         };

		       let options = new RequestOptions({ headers: headers });

		  

				let loader = this.loading.create({

				   content: "Requesting change please wait…",

				 });

			   loader.present().then(() => 
				{

			   this.http.post(this.apiValue.baseURL+"/user_changepass",data,options) //Http request returns an observable

			   .map(response => response.json()) ////To make it easy to read from observable

			   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
						  
					{ 
				   			console.log(serverReply);
				   			loader.dismiss();

				   			if("message" in serverReply)
               {
                  this.passwordInvalid = serverReply.message;
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
