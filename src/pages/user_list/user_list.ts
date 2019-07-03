import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {DashboardPage} from '../dashboard/dashboard';
import {SingleUserPage} from './single_user/single_user';

import {Events} from 'ionic-angular';

import {ApiValuesProvider} from '../../providers/api-values/api-values';

@Component({
  selector: 'user_list',
  templateUrl: 'user_list.html'
})

export class UserListPage 
{
	constructor(public events:Events,public apiValue:ApiValuesProvider,public navCtrl: NavController, public navParams: NavParams,
	 public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,
	 public toastCtrl: ToastController, public menuCtrl: MenuController)
	{
		
	}

	users:any; 
	u_search: string;


	ionViewDidEnter()
	{
		//This method is fired when this view is entered each time
		this.fetchData(); //Update the table
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}

	fetchData()
	{
	
	   var headers = new Headers();
	   this.users=[];

       let options = new RequestOptions({ headers: headers });

  

       let data = { //Data to be sent to the server

       		search:this.u_search
         };

		let loader = this.loading.create({

          content: "Loading ...",

		 });

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/user_list",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   			console.log(serverReply);
		   			loader.dismiss();

		   			if('message' in serverReply) //incorrect login
					{
					
						
						const toast = this.toastCtrl.create({
							  message: serverReply.message,
							  duration: 5000
							});
							toast.present();
					}
					else
					{
						this.users=serverReply;
					}

				  
			      

			   });

  		 });
		

    }
    viewSingleUser(user_id)
    {
    	let data={

    		id: user_id
    	}
    	console.log("Clicked User ID:"+user_id);

    	this.navCtrl.push(SingleUserPage,data);
    }
}
