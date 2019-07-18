import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Events} from 'ionic-angular';

import { UserAccount } from '../../models/user_account.model';
import { CaseType } from '../../models/case_type.model';

import {SingleUserAccountPage} from './single_user_account/single_user_account';
import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { AdvocateListProvider } from '../../providers/advocate-list/advocate-list';
import { CaseTypeProvider } from '../../providers/case-type/case-type';

@Component({
  selector: 'account_management',
  templateUrl: 'account_management.html'
})

export class AccountManagementPage
{
	c_case_type:string='';
	c_case_year:string='';
	c_case_manager:string='';
  c_search: string='';

  setDetailVisible: boolean = false;
  blurAmount: string = '';
  caseManagerList: any;
  accounts: UserAccount[] = [];
  detailAccount: UserAccount;

  caseTypeList: CaseType[]=[];

  constructor(public advocateListProvider: AdvocateListProvider,
    public caseTypeProvider: CaseTypeProvider,
    public events: Events,
    public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController)
	{
    this.getManagers();
    this.fetchData();

    if (this.caseTypeProvider.isEmpty)
    {
      this.showToast('Failure!!! Cannot get Case types');
    }
  
    this.caseTypeList = this.caseTypeProvider.caseTypeList; //Return even if empty

	}

  openClient(account: UserAccount)
	{
		//later add the id of the client in the data field that will be sent to SingleUserAccountPage
    let data =
    {
      clientPassed: account.id,
      accountDetails: account
    };
    console.log(data);
		this.navCtrl.push(SingleUserAccountPage,data);
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
  }

  showDetails(account)
  {

    if (this.setDetailVisible == true)
    {
      //Already Visible

      //Set it to false so that the div hides and don't do anything
      this.hideDetails();
      return;
    }
    this.setDetailVisible = true;
    this.blurAmount = 'blurDiv';
    this.detailAccount = account;

  }

  getManagers()
  {
    this.advocateListProvider.getAdvocateList().map(response => response.json())
      .subscribe(serverReply => {

        console.log(serverReply);
       
        if (serverReply == null || serverReply.length == 0)
        {
          this.presentToast("Failure in getting Manager List");
        }
        else
        {
          this.caseManagerList = serverReply;
        }
      })

  }

  presentToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration:3000
    });

    toast.present();
  }

  hideDetails()
  {
    this.setDetailVisible = false;
    this.blurAmount = '';
  }

  fetchData()
  {
    //http://myamenbizzapp.com/dsd/api_work/getuser_account_management.php?
    //case_type = 1 & year=2019 & advocate=8 & keyword=pl01@gamil.com


    this.accounts = [];

    const loader = this.loading.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('case_type', this.c_case_type);
      body.append('year', this.c_case_year);
      body.append('advocate', this.c_case_manager);
      body.append('keyword', this.c_search);

      this.http.post(this.apiValue.baseURL + "/getuser_account_management.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                this.showToast(data.message);
                return;
              }
              else
              {
                this.accounts = data;

              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Timeout!!! Server did not respond');
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
}

