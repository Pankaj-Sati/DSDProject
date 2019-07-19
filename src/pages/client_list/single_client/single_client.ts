import {Component} from '@angular/core';

import { IonicPage, NavController, NavParams, AlertController, PopoverController, Header, NavOptions} from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import "rxjs/add/operator/map";

//Sub Pages
import { ChangeManagerPage } from './change_manager/change_manager';
import { SendSMSPage } from './send_sms/send_sms';
import { NotesListPage } from './notes/notes';
import { ClientDocumentsPage } from './document/document';
import { ClientCommunicationsPage } from './communications/communications';
import { ClientPaymentPage } from './payment/payment';
import { HearingDetailsPage } from './hearing_details/hearing_details';
import { EditClientPage } from './edit_client/edit_client';


import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../providers/my-storage/my-storage';
import { CaseTypeProvider } from '../../../providers/case-type/case-type';

import { Client, ClientDetails, Entity } from '../../../models/client.model';
import { AdvocateDropdown } from '../../../models/ advocate.model';
import { User } from '../../../models/login_user.model';

import { ClientDetailActionsComponent } from '../../../components/client-detail-actions/client-detail-actions';
import { CaseType } from '../../../models/case_type.model';


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

  loggedInUser: User; //To store data of the logged in user

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


  constructor(public myStorage: MyStorageProvider,
    public popover: PopoverController,
    public apiValue: ApiValuesProvider,
    public caseTypeProvider: CaseTypeProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private http: Http,
    public loading: LoadingController)
  {
    this.loggedInUser = this.myStorage.getParameters();
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
      data.append('cid', String(this.client.id));

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

            //Map case type with its string
            this.clientDetails.case_type = this.caseTypeProvider.getCaseType(this.clientDetails.case_type);

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

          id: this.client.cid,
          name: this.clientDetails.name,
          advocate: this.clientDetails.caseManagerName
		};

		this.navCtrl.push(ChangeManagerPage,data);
	}

  sendSms()
  {
    let data = {
      contact: this.clientDetails.contact,
      client_id: this.clientDetails.id
    }
    this.navCtrl.push(SendSMSPage,data);
  }

  showActions(clickEvent)
  {
    const popover = this.popover.create(ClientDetailActionsComponent);
    popover.present({
      ev: clickEvent
    });

    popover.onDidDismiss((data) =>
    {
      console.log("Popover Dismissed");

      if (data != null || data != undefined)
      {
        console.log(data.selectedOption);

        switch (data.selectedOption)
        {

          case 0: //Change Manager
            this.changeCaseManager();
            break;
          case 1: //Payment
            this.clientPayments();
            break;
          case 2: //Hearing Details
            this.clientHearingDetails();
            break;
          case 3: //Communications
            this.clientCommunications();
            break;
          case 4: //Delete
            this.deleteClientAlert();
            break;
          case 5: //Notes
            this.clientNotes();
            break;
          case 6: //Documents
            this.clientDocuments();
            break;
          case 7: //Send SMS
            this.sendSms();
            break;
          case 8://Edit Client
            this.editClient();
            break;
        }

      }
    });
  }

  editClient()
  {
    let data =
    {
      client: this.client,
      clientDetails: this.clientDetails,
      entityDetails: this.entities
    };

    this.navCtrl.push(EditClientPage,data);
  }

  deleteClientAlert()
  {
    const alert = this.alertCtrl.create(
      {
        message: 'Delete all the records of this client?',
        title: 'Attention!',
        buttons: [{

          text: 'Confirm',
          handler: () =>
          {
            console.log("Delete Client Confirm");
            this.deleteClient();
          }
          
        },
          {
            text: "Cancel",
            handler: () =>
            {
              console.log("Delete Client Cancelled");
            }
          }
        ],

      });
    alert.present();

  }

  deleteClient()
  {
    const loader = this.loading.create({

      content: 'Deleting Client...',
      duration:15000
    });

    loader.present();
    let loadingSuccessful = false; //To know whether the loader ended due to timeout or not

    let header = new Headers();
    let options = new RequestOptions({ headers: header });

    let body = new FormData();
    body.append('rowID', String(this.client.id));
    body.append('session_id', this.loggedInUser.id);

    this.http.get(this.apiValue.baseURL + "/client_delete.php?rowID=" + this.clientDetails.id + "& session_id=" + this.loggedInUser.id)
      .subscribe(response =>
      {
        loadingSuccessful = true;
        loader.dismiss();

        if (response)
        {
          try
          {
            let result = JSON.parse(response['_body']);
            if('code' in result) 
            {
              this.showToast(result.message);

              if (result.code == 200)
              {
                //Successfully Deleted
                this.navCtrl.getPrevious().data.reload = true;
                this.navCtrl.pop(); //Sending data along with pop
              }
              return;
            }
            else
            {
              this.showToast(result.message);
              return;
            }
          }
          catch (err)
          {
            this.showToast('Failed to delete the client');
          }
        }
        else
        {
          this.showToast('Failed to delete the client');
        }
      },
        error =>
        {
          loadingSuccessful = true;
          this.showToast('Failed to delete the client');
          loader.dismiss();
        });

    loader.onDidDismiss(() => {

      if(!loadingSuccessful)
      {
        this.showToast('Timeout!!! Server Did not respond');
      }
    })
  }

  clientNotes()
  {
    let data = {
      client_id: this.client.id
    };
    this.navCtrl.push(NotesListPage, data);
  }

  clientDocuments()
  {
    let data = {
      client_id: this.client.id
    };
    this.navCtrl.push(ClientDocumentsPage, data);
  }

  clientCommunications()
  {
    let data = {
      client: this.client
    };
    this.navCtrl.push(ClientCommunicationsPage, data);
  }

  clientPayments()
  {
    let data =
    {
      clientID: this.client.id,
      clientdetails: this.clientDetails,
      showAddBalance:true
    };

    this.navCtrl.push(ClientPaymentPage, data);
  }

  clientHearingDetails()
  {
    let data =
    {
      client: this.client, //For passing the ID
      clientdetails: this.clientDetails
    };

    this.navCtrl.push(HearingDetailsPage, data);
  }
}
