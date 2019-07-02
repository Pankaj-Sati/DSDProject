import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController,ToastController } from "ionic-angular";
import "rxjs/add/operator/map";

import {ApiValuesProvider} from '../../providers/api-values/api-values';

import {Events} from 'ionic-angular';
@Component({
  selector: 'page-reminders',
  templateUrl: 'reminders.html'
})
export class RemindersPage 
{
	
	rm_from:string;
	rm_to:string;
	rm_search:string;
	reminders:any;
	setDetailVisible:boolean;
	detailReminder:any;
	blurAmount:string;


	constructor(public apiValue:ApiValuesProvider,public events:Events,public toastCtrl:ToastController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController)
	{
		this.fetchData();
        this.setDetailVisible=false;
    }

 	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}

 	hideDetails()
 	{
 		this.setDetailVisible=false;
 		this.blurAmount='';
 	}

 	showDetails(reminder)
 	{
 		if(this.setDetailVisible==true)
 		{
 			//Already Visible
 		
 		 //Set it to false so that the div hides and don't do anything
 			this.hideDetails();
 			return;
 		}
 		this.setDetailVisible=true;
 		this.blurAmount='blurDiv';
 		this.detailReminder=reminder;
 	}

	fetchData()
	{
	
	   var headers = new Headers();
	   this.reminders=[];

       headers.append("Accept", "application/json");

       headers.append("Content-Type", "application/json" );

       let options = new RequestOptions({ headers: headers });

  

       let data = { //Data to be sent to the server

           from_date:this.rm_from,
		   to_date:this.rm_to,
		   search:this.rm_search
         };

		let loader = this.loading.create({

		   content: "Loading...",
		   duration:5000

		 });

		let hasServerReplied:boolean=false; //To check whether the server replied

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/reminders",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   			console.log(serverReply);
		   			hasServerReplied=true;
		   			 this.reminders=serverReply;

		   			loader.dismiss();
		   		  	
				   
			      

			   });

  		 });

	   loader.onDidDismiss(()=>{

	   	if(hasServerReplied==false)
	   	{
	   		const toast=this.toastCtrl.create({

	   			message:'No reply from server',
	   			duration:3000
	   		});
	   		toast.present();
	   	}

	   });
		

    }
	
}
