import {Component} from '@angular/core';

import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import "rxjs/add/operator/map";

import {ChangeManagerPage} from './change_manager/change_manager';
import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { Client } from '../../../models/client.model';
import { AdvocateDropdown } from '../../../models/ advocate.model';

@Component({
  selector: 'single_client',
  templateUrl: 'single_client.html'
})
export class SingleClientPage
{
  public client: Client;

  showCaseDetails: boolean = true;
  showPersonalDetails: boolean = false;
  showParmanentAddressDetails: boolean = false;
  showCaseManagerDetails: boolean = false;
  showDefendantDetails: boolean = false;


	 ionViewDidLoad()
    {
    		//This method is called when the page loads for the first time
       this.client = this.navParams.get('clientPassed'); //Get the id field passed from the user_list page
       console.log("Received Client");
       console.log(this.client);


   }
	ionViewDidEnter()
	{
		//This method is fired when this view is entered each time
		//this.fetchData(); //Update the table
  }


  constructor(public apiValue: ApiValuesProvider, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public alertCtrl: AlertController, public toastCtrl: ToastController, private http: Http, public loading: LoadingController)
  {
    
  }

  toggleShowMore(id)
  {
    switch (id)
    {
      case 0: this.showCaseDetails = ! this.showCaseDetails;
        break;
      case 1: this.showPersonalDetails = !this.showPersonalDetails;
        break;
      case 2: this.showParmanentAddressDetails = !this.showParmanentAddressDetails;
        break;
      case 3: this.showCaseManagerDetails = !this.showCaseManagerDetails;
        break;
      case 4: this.showDefendantDetails = !this.showDefendantDetails;
        break;
    }
  }

	fetchData()
	{
	   var headers = new Headers();

       let options = new RequestOptions({ headers: headers });

  

      let data = new FormData();
      data.append('cid', String(this.client.cid));

		let loader = this.loading.create({

          content: "Loading ...",
          duration:15000

		 });
      let loadingSuccessful = false; //To know whether the loader timeout occured or not
	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/client_view.php",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
       {
            loadingSuccessful = true;
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
						this.client=serverReply[0];
						console.log("Client:"+this.client);
						
					}

				  
			      

       },
         error => {
           loadingSuccessful = true;
           this.showToast('Failed to load data');
         });

       });

      loader.onDidDismiss(() => {

        if (!loadingSuccessful)
        {
          this.showToast('Server Did Not Respond!!!');
        }
      });
		
    }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  changeCaseManager()
  {
    console.log("ChangeCaseManager():" + this.client.id);

		let data={

          id:this.client.cid,
          name: this.client.client_name,
          advocate: this.client.caseManagerName
		};

		this.navCtrl.push(ChangeManagerPage,data);
	}

}
