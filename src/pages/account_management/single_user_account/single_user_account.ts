import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, Header, NavOptions } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import "rxjs/add/operator/map";

import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../providers/my-storage/my-storage';
import { CaseTypeProvider } from '../../../providers/case-type/case-type';


//Sub Pages
import { PaymentAccountManagementPage } from './payment/payment';
import { PaymentSummaryPage } from './payment_summary/payment_summary';

import { SendSMSPage } from '../../client_list/single_client/send_sms/send_sms';
import { ClientPaymentPage } from '../../client_list/single_client/payment/payment';

import { Client, ClientDetails, Entity } from '../../../models/client.model';
import { AdvocateDropdown } from '../../../models/ advocate.model';
import { User } from '../../../models/login_user.model';

import { ShowMoreUserAccountOptionsComponent } from '../../../components/show-more-user-account-options/show-more-user-account-options';
import { UserAccount } from '../../../models/user_account.model';

@Component({
  selector: 'single_user_account',
  templateUrl: 'single_user_account.html'
})


export class SingleUserAccountPage
{
  public clientID;//To hold the client ID passed from the list
  public clientDetails: ClientDetails; //To display the client details
  public entities: Entity[] = []; //To display the entities of this client

  public passedAccountDetails: UserAccount;
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
    this.clientID = this.navParams.get('clientPassed'); //Get the id field passed from the user_list page
    this.passedAccountDetails = this.navParams.get('accountDetails'); //Get the id field passed from the user_list page
  
    console.log("Received Client");
    console.log(this.clientID);
    console.log(this.passedAccountDetails);
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
      case 0: this.showCaseDetails = !this.showCaseDetails;
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
    data.append('cid', String(this.clientID));

    let loader = this.loading.create({

      content: "Loading ...",
      duration: 15000

    });
    let loadingSuccessful = false; //To know whether the loader timeout occured or not
    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/client_view.php", data, options) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          console.log(serverReply);


          if ('message' in serverReply) //incorrect
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
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to load data');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

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

  

  sendSms()
  {
    let data = {
      contact: this.clientDetails.contact,
      client_id: this.clientDetails.id
    }
   this.navCtrl.push(SendSMSPage, data);
  }

  showActions(clickEvent)
  {
    const popover = this.popover.create(ShowMoreUserAccountOptionsComponent);
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

          case 0: //Payment Summary
            this.viewPaymentSummary();
            break;
          case 1: //Add Payment
            this.addPayment();
            break;
          case 2: //Send SMS
            this.sendSms();
            break;

        }

      }
    });
  }

  viewPaymentSummary()
  {
    let data =
    {
      clientID: this.clientID,
      accountDetails: this.passedAccountDetails
    }
    this.navCtrl.push(PaymentSummaryPage, data);
  }

  addPayment()
  {
    let data =
    {
      clientID: this.clientID,
      clientdetails: this.clientDetails,
      showAddBalance:false
    }
    this.navCtrl.push(ClientPaymentPage, data);
  }

}
