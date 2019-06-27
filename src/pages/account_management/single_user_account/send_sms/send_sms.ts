import { Component, ViewChild, ElementRef, } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'send_sms',
  templateUrl: 'send_sms.html'
})


export class SendSMSAccountManagementPage
{
	s_contact:string;
	s_message:string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController, public menuCtrl: MenuController) 
	{

	}

	createAlert(sub_title)
	{
		let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:sub_title,

			buttons: ["OK"]

			});

			alert.present();
	}

		

	sendSMS()
	{
		if(this.s_contact==null || this.s_contact.length==0)
		{
			this.createAlert('Number cannot be null');
			return; //exit from the function
		}
		if(this.s_message==null || this.s_message.length==0)
		{
			this.createAlert('Message cannot be null');
			return; //exit from the function
		}

		//The following lines will execute only if the above if statements are not matched
	}
}