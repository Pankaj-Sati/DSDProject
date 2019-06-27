
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";


import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";

import{SingleClientPage} from '../single_client';
import {AdvocateListProvider} from '../../../../providers/advocate-list/advocate-list';
import {Events} from 'ionic-angular';

import {ApiValuesProvider} from '../../../../providers/api-values/api-values';

@Component({
  selector: 'change_manager',
  templateUrl: 'change_manager.html'
})


export class ChangeManagerPage
{
	passed_c_id:string;
	passed_c_name:string;
	passed_c_manager:string;
	advocate_list:any;
	loader:any;

	 constructor(public apiValue:ApiValuesProvider,public events:Events,public advocateList: AdvocateListProvider,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,public toastCtrl: ToastController,  private http: Http,  public loading: LoadingController)
	{
		this.fetchData();

		console.log("In Change Manger Page");
		this.events.subscribe('advocateListEvent',(data)=>{
			console.log(data);
			this.loader.dismiss();
			if(this.loader!=null)
			{
				this.advocate_list=data;
				
			}
			else
			{
				const toast=this.toastCtrl.create({
					message:"Cannot find advocate list on server",
					duration:3000
				});
				toast.present();
			}

		});
	}
	fetchData()
	{

		 this.loader=this.loading.create({
			content: "Fetching manager list please wait…",
		});

		this.loader.present().then(()=>{

			this.advocateList.fetchList();
			
		});
	}


	ionViewDidLoad()
	{
		//This method is called once when the view is loaded
		this.passed_c_id=this.navParams.get('id'); //Getting the id that is passed from previous page
		this.passed_c_name=this.navParams.get('name');
		console.log('CM Id received='+this.passed_c_id);
	}


	changeManager()
	{

		console.log("Received Alien No.="+this.passed_c_id);

		if(this.passed_c_manager==null || this.passed_c_manager.length==0)
			 {

				let alert = this.alertCtrl.create({

				 title:"ATTENTION",

				subTitle:"Case Manager not selected",

				buttons: ["OK"]

				});

				alert.present();
				return;

		     } 

			   var headers = new Headers();

		       headers.append("Accept", "application/json");

		       headers.append("Content-Type", "application/json" );

		       let options = new RequestOptions({ headers: headers });

		       let data=
		       {

					cid:this.passed_c_id,
					advocate_id:this.passed_c_manager
				

		         };
				let loader = this.loading.create
				({

				   content: "Changing manager please wait…",

				 });

			   loader.present().then(() => 
				{

			   this.http.post(this.apiValue.baseURL+"/change_case_manager",data,options) //Http request returns an observable

			   .map(response => response.json()) ////To make it easy to read from observable

			   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
						  
					{ 
				   			console.log(serverReply);
				   			loader.dismiss();

				   			if('message' in serverReply)
				   			{
				   				const toast = this.toastCtrl.create({
										  message: serverReply.message,
										  duration: 3000
										});
										toast.present();	
				   			}
				   			else
				   			{
				   					const toast = this.toastCtrl.create({
										  message: 'Error!!!',
										  duration: 3000
										});
										toast.present();	
				   			}
				   			

				   			//this.advocate_list=serverReply;
					      
					   });

		  		 });


	}

	getCaseManagerList()
	{
		this.advocate_list=[];

		var headers = new Headers();

	       headers.append("Accept", "application/json");

	       headers.append("Content-Type", "application/json" );

	       let options = new RequestOptions({ headers: headers });

	       let data=
	       {

	         };
			let loader = this.loading.create({

			   content: "Getting info. please wait…",

			 });

		   loader.present().then(() => 
			{

		   this.http.post(this.apiValue.baseURL+"/get_advocate",data,options) //Http request returns an observable

		   .map(response => response.json()) ////To make it easy to read from observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
					  
				{ 
			   			console.log(serverReply);
			   			loader.dismiss();

			   			//this.advocate_list=serverReply;
				      
				   });

	  		 });
	}
}