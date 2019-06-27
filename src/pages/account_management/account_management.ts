import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Events} from 'ionic-angular';

import {SingleUserAccountPage} from './single_user_account/single_user_account';
import {ApiValuesProvider} from '../../providers/api-values/api-values';

@Component({
  selector: 'account_management',
  templateUrl: 'account_management.html'
})

export class AccountManagementPage
{
	c_case_type:string;
	c_case_year:string;
	c_case_manager:string;
	c_search:string;

	constructor(public events:Events,public apiValue:ApiValuesProvider,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController, public menuCtrl: MenuController) 
	{
		this.c_case_type='1';
		this.c_case_year='2018';
		this.c_case_manager='1';

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
}