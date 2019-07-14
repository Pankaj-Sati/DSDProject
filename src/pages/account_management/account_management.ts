import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Events} from 'ionic-angular';

import {SingleUserAccountPage} from './single_user_account/single_user_account';
import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { AdvocateListProvider } from '../../providers/advocate-list/advocate-list';

@Component({
  selector: 'account_management',
  templateUrl: 'account_management.html'
})

export class AccountManagementPage
{
	c_case_type:string;
	c_case_year:string;
	c_case_manager:string;
  c_search: string;
  setDetailVisible: boolean = false;
  blurAmount: string = '';
  caseManagerList: any;
  accounts: UserAccount[] = [];
  detailAccount: UserAccount;

  constructor(public advocateListProvider: AdvocateListProvider, public events: Events, public apiValue: ApiValuesProvider, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: Http, public loading: LoadingController, public toastCtrl: ToastController, public menuCtrl: MenuController) 
	{
		this.c_case_type='1';
		this.c_case_year='2018';
    this.c_case_manager = '1';

    this.accounts = [

      new UserAccount("Client 1","New Manager 1", 200,"Active","123","2019",4000,3000),
      new UserAccount("Client 2","New Manager 2", 0,"Active","123231","2019",43000,53000),
      new UserAccount("Client 3","New Manager 3", 6000,"Active","12we3","2019",24000,23000),
      new UserAccount("Client 4","New Manager 4", 200,"Active","123","2019",4000,3000),
    ];

    this.getManagers();
	}

	openClient()
	{
		//later add the id of the client in the data field that will be sent to SingleUserAccountPage
		let data={

		};
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

}

class UserAccount
{
  client_name: string;
  manager: string;
  outstanding: number;
  status: string;
  alien_no: string;
  year: string;
  total_amount: number;
  given_amount: number;

  constructor(name: string,
    manager: string,
    outstanding: number,
    status: string,
    alien_no: string,
    year: string,
    total_amount: number,
    given_amount: number)

  {

    this.client_name= name;
    this.manager= manager;
    this.outstanding = outstanding;
    this.status = status;
    this.alien_no = alien_no;
    this.year=year;
    this.total_amount = total_amount;
    this.given_amount = given_amount;

  }

}
