import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import {UserType} from "../../raw_data/raw_data";
import {ChangeUserPasswordPage} from "../change_user_password/change_user_password";
import {UpdateUserPage} from "../update_user/update_user";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";

import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../providers/my-storage/my-storage';
import { UserTypesProvider } from '../../../providers/user-types/user-types';

import { ViewImageComponent} from '../../../components/view-image/view-image';
import { User } from '../../../models/login_user.model';


@Component({
	selector: 'single_user',
	templateUrl:'single_user.html'
})

export class SingleUserPage 
{

	passed_user_id:string;
	user:any=null;
  user_type: any;
  loggedInUser: User;

	

  constructor(public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    public myStorage: MyStorageProvider,
    public userTypesProvider: UserTypesProvider,
  ) 
  {

    this.loggedInUser = this.myStorage.getParameters();
		this.user_type=new UserType();
    }

    ionViewDidLoad()
    {
    		//This method is called when the page loads for the first time
    		this.passed_user_id=this.navParams.get('id'); //Get the id field passed from the user_list page
      console.log("Id received=" + this.passed_user_id);
      this.fetchData();

    }

  ionViewDidEnter()
  {
    if(this.navParams.data.reload)
    {
      this.fetchData();
    }
  }


    fetchData()
	{
	
		this.user=null;
	   var headers = new Headers();

       let options = new RequestOptions({ headers: headers });

  

       let data = 
         { //Data to be sent to the server

         };

		let loader = this.loading.create({

          content: "Loading ...",

		 });

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/user_view/"+this.passed_user_id,data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   			console.log(serverReply[0]);
		   			loader.dismiss();

		   			if('message' in serverReply) //incorrect
					{
					
						
						const toast = this.toastCtrl.create({
							  message: serverReply.message,
							  duration: 5000
							});
							toast.present();
					}
					else
					{
						this.user=serverReply[0];
						
					}

				  
			      

			   });

  		 });
		

    }

    deleteUser()
    {
    	let alert = this.alertCtrl.create({
	    title: 'Confirm Delete!!!',
	    message: 'Are you sure that you want to delete this user?',
	    buttons: [
	      {
	        text: 'No',
	        role: 'cancel',
	        handler: () => {
	          console.log('Cancel clicked');
	        }
	      },
	      {
	        text: 'Delete',
	        handler: () => {
	          console.log('Buy clicked');

	          	this.sendDeleteUserRequest();

	        }
	      }
	    ]
	  });
	  alert.present()
    }

   sendDeleteUserRequest()
   {
   		var headers = new Headers();

       let options = new RequestOptions({ headers: headers });

  

     let data = new FormData();

     data.set('rowID', this.passed_user_id);
     data.set('session_id', this.loggedInUser.id);
        

		let loader = this.loading.create({

		   content: "Deleting user please wait…",

		 });

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/user_delete.php",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   			console.log(serverReply);
		   			loader.dismiss();

		   			if('message' in serverReply) //incorrect
					{
					
	  						 const toast = this.toastCtrl.create({
							  message: serverReply.message,
							  duration: 5000
							});
							toast.present();
					}

					if('code' in serverReply && serverReply.code==200)
					{
						//Successfully deleted

						this.navCtrl.pop(); //Pop the current page from the stack
					}

			   });

  		 });
   }

   changePassword(u_name)
   {
   	let data={
   		name:u_name,
   		id:this.passed_user_id
   	}
   	this.navCtrl.push(ChangeUserPasswordPage,data);
   }

   editUser()
   {
	   	
	   		let data=
	   		{
	   			id:this.passed_user_id
	   		}
	   	this.navCtrl.push(UpdateUserPage,data);
	   

	  
   }

  getUserType(id)
  {
    return this.userTypesProvider.getUserTypeName(id);
  }

  viewImage(profile_img)
  {
    let data =
    {
      imageURL: this.apiValue.baseImageFolder + profile_img
    }

    this.navCtrl.push(ViewImageComponent, data);
  }
  
}
