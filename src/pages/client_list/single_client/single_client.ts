import {Component} from '@angular/core';

import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import "rxjs/add/operator/map";

import {ChangeManagerPage} from './change_manager/change_manager';
import {ApiValuesProvider} from '../../../providers/api-values/api-values';

@Component({
  selector: 'single_client',
  templateUrl: 'single_client.html'
})
export class SingleClientPage
{
	passed_client_id:string;
	clients:any;

	 ionViewDidLoad()
    {
    		//This method is called when the page loads for the first time
    		this.passed_client_id=this.navParams.get('id'); //Get the id field passed from the user_list page
    		console.log("Id received="+this.passed_client_id);
    		

    }
	ionViewDidEnter()
	{
		//This method is fired when this view is entered each time
		this.fetchData(); //Update the table
	}
    constructor(public apiValue:ApiValuesProvider,public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder, public alertCtrl: AlertController,public toastCtrl: ToastController,  private http: Http,  public loading: LoadingController)
	{
		
	}

	fetchData()
	{
	   
	   this.clients=[];

	   var headers = new Headers();

       let options = new RequestOptions({ headers: headers });

  

       let data = new FormData(); 
        data.append('cid',this.passed_client_id);

		let loader = this.loading.create({

          content: this.passed_client_id +"Loading ...",

		 });

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/client_view.php",data,options) //Http request returns an observable

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
					else
					{
						this.clients=serverReply;
						console.log("Client:"+this.clients);
						
					}

				  
			      

			   });

  		 });
		
	}

	changeCaseManager(client_name)
	{
		console.log("ChangeCaseManager():"+this.passed_client_id);

		let data={

			id:this.passed_client_id,
			name:client_name
		};

		this.navCtrl.push(ChangeManagerPage,data);
	}

}
