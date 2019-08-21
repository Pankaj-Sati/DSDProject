import { Component, ViewChild, ElementRef, } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiValuesProvider} from '../../../../providers/api-values/api-values'

@Component({
  selector: 'payment',
  templateUrl: 'payment.html'
})

export class PaymentAccountManagementPage
{

	 paymentMode: ElementRef;
	 p_amount:string;
	 p_remark:string;
	 p_card_name:string;
	 p_card_number:string;
	 p_card_cvv:string;
	 p_card_ex_month:string;
	 p_card_ex_year:string;
	 p_transfer_b_name:string;
	 p_transfer_name:string;
	 p_transfer_acc_no:string;
	 p_transfer_b_code:string;
	 p_transfer_b_no:string;

	 selectedPaymentMode:number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public apiValue: ApiValuesProvider,
    public menuCtrl: MenuController) 
	{
		this.selectedPaymentMode=1; //Default to 1 i.e cash
	}

	onPaymentModeChange(value)
	{
		this.selectedPaymentMode= value; 
		console.log("Changed Select Value="+value);
	
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

	addBalance()
	{

		if(this.p_amount==null || this.p_amount.length==0)
		{
			this.createAlert('Amount cannot be null');
			return; //exit from the function
		}

		//Following lines will execute if the above "if" statement is not entered

		if(this.p_amount==null || this.p_amount.length==0)
		{
			this.createAlert('Amount cannot be null');
			return; //exit from the function
		}

		if(this.selectedPaymentMode==1)
		{
				//Direct submit
		}
		else if(this.selectedPaymentMode==2)
		{
			if(this.p_card_name==null || this.p_card_name.length==0)
			{
				this.createAlert('Card Holder name cannot be null');
				return; //exit from the function
			}

			if(this.p_card_number==null || this.p_card_number.length==0)
			{
				this.createAlert('Card number cannot be null');
				return; //exit from the function
			}
			if(this.p_card_cvv==null || this.p_card_cvv.length==0)
			{
				this.createAlert('CVV. number cannot be null');
				return; //exit from the function
			}
			if(this.p_card_ex_year==null || this.p_card_ex_year.length==0)
			{
				this.createAlert('Card Expiry year cannot be null');
				return; //exit from the function
			}
			if(this.p_card_ex_month==null || this.p_card_ex_month.length==0)
			{
				this.createAlert('Card Expiry month cannot be null');
				return; //exit from the function
			}
		}
		else if(this.selectedPaymentMode==3)
		{
			if(this.p_transfer_name==null || this.p_transfer_name.length==0)
			{
				this.createAlert('Account Holder Name cannot be null');
				return; //exit from the function
			}	
			if(this.p_transfer_b_name==null || this.p_transfer_b_name.length==0)
			{
				this.createAlert('Bank Name cannot be null');
				return; //exit from the function
			}	
			if(this.p_transfer_b_no==null || this.p_transfer_b_no.length==0)
			{
				this.createAlert('Branch number cannot be null');
				return; //exit from the function
			}
			if(this.p_transfer_b_code==null || this.p_transfer_b_code.length==0)
			{
				this.createAlert('Branch Code cannot be null');
				return; //exit from the function
			}
			if(this.p_transfer_acc_no==null || this.p_transfer_acc_no.length==0)
			{
				this.createAlert('Account number cannot be null');
				return; //exit from the function
			}			
		}
		else
		{
			this.createAlert('Payment Option Not selected');
		}
	}

}
