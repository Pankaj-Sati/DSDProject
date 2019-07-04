
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";


import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";

import{SingleClientPage} from '../single_client';
import {AdvocateListProvider} from '../../../../providers/advocate-list/advocate-list';
import {Events} from 'ionic-angular';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { AdvocateDropdown } from '../../../../models/ advocate.model';
import { User } from '../../../../models/login_user.model';

import {MyStorageProvider } from '../../../../providers/my-storage/my-storage';

@Component({
  selector: 'change_manager',
  templateUrl: 'change_manager.html'
})


export class ChangeManagerPage
{
	passed_c_id:string;
	passed_c_name:string;
	passed_c_manager:string;
  advocate_list: any;
  caseAdvocate: string;
  loader: any;
  loggedInUser: User;

  constructor(public myStorage: MyStorageProvider, public apiValue: ApiValuesProvider, public events: Events, public advocateList: AdvocateListProvider, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public toastCtrl: ToastController, private http: Http, public loading: LoadingController)
  {

    this.loggedInUser = this.myStorage.getParameters();
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
           content: "Loading ...",
		});

		this.loader.present().then(()=>{

			this.advocateList.fetchList();
			
		});
	}


	ionViewDidLoad()
	{
		//This method is called once when the view is loaded
		this.passed_c_id=this.navParams.get('id'); //Getting the id that is passed from previous page
      this.passed_c_name = this.navParams.get('name');
      this.caseAdvocate = this.navParams.get('advocate');

		console.log('CM Id received='+this.passed_c_id);
		console.log(+this.caseAdvocate);
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
          let options = new RequestOptions({ headers: headers });

		       let data=
		       {

					      cid:this.passed_c_id,
                 advocate_id: this.passed_c_manager,
                 session_id: this.loggedInUser.id
				

      };
      let body = new FormData();
      body.append('cid', this.passed_c_id);
      body.append('advocate_id', this.passed_c_manager);
      body.append('session_id', this.loggedInUser.id);

				let loader = this.loading.create
				({

				   content: "Changing manager…",

				 });

			   loader.present().then(() => 
				{

			   this.http.post(this.apiValue.baseURL+"/change_case_manager.php",body,options) //Http request returns an observable

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

}
