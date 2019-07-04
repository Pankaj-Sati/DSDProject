import {Component} from '@angular/core';

import { IonicPage, NavController, NavParams, AlertController, PopoverController} from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import "rxjs/add/operator/map";

import {ChangeManagerPage} from './change_manager/change_manager';
import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { Client, ClientDetails, Entity } from '../../../models/client.model';
import { AdvocateDropdown } from '../../../models/ advocate.model';

import { ClientDetailActionsComponent } from '../../../components/client-detail-actions/client-detail-actions';

@Component({
  selector: 'single_client',
  templateUrl: 'single_client.html'
})
export class SingleClientPage
{
  public client: Client; //To hold the client passed from the list
  public clientDetails: ClientDetails; //To display the client details
  public entities: Entity[] = []; //To display the entities of this client

  showCaseDetails: boolean = true;
  showPersonalDetails: boolean = false;
  showParmanentAddressDetails: boolean = false;
  showCaseManagerDetails: boolean = false;
  showDefendantDetails: boolean = false;
  showEntityDetails: boolean = false;


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
		this.fetchData(); //Update the table
  }


  constructor(public popover: PopoverController, public apiValue: ApiValuesProvider, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public alertCtrl: AlertController, public toastCtrl: ToastController, private http: Http, public loading: LoadingController)
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
      case 5: this.showEntityDetails = !this.showEntityDetails;
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
		   			

		   		if('message' in serverReply) //incorrect
          {
                this.showToast(serverReply.message);
					}
					else
					{
            this.clientDetails = serverReply[0].data;
            this.entities = serverReply[0].entity;
						console.log("Client:");
            console.log(this.clientDetails);
            console.log("Entities:");
            console.log(this.entities);
						
           }
         loader.dismiss();

				  
			      

       },
         error => {
           loadingSuccessful = true;
           this.showToast('Failed to load data');
		   			loader.dismiss();
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

  showActions(clickEvent)
  {
    const popover = this.popover.create(ClientDetailActionsComponent);
    popover.present({
      ev: clickEvent
    });
  }
}
