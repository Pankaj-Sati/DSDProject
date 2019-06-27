import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import {PaymentSummaryPage} from './payment_summary/payment_summary';
import {PaymentAccountManagementPage} from './payment/payment';
import {SendSMSAccountManagementPage} from './send_sms/send_sms';


@Component({
  selector: 'single_user_account',
  templateUrl: 'single_user_account.html'
})


export class SingleUserAccountPage
{

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController, public menuCtrl: MenuController) 
	{

	}

	viewPaymentSummary()
	{
		let data={

		};

		this.navCtrl.push(PaymentSummaryPage,data);
	}

	addPayment()
	{

		let data={

		};

		this.navCtrl.push(PaymentAccountManagementPage,data);
	}

	sendSMS()
	{
		let data={

		};

		this.navCtrl.push(SendSMSAccountManagementPage,data);
	}
}
