import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import "rxjs/add/operator/map";

import {ApiValuesProvider} from '../../../providers/api-values/api-values';

@Component({
  selector: 'add_client',
  templateUrl: 'add_client.html'
})



export class AddClientPage
{
	
	c_case_type:string;
	c_alien_no:string;
	c_case_category:string;
	c_case_description:string;
	c_date:Date;
	c_name:string;
	c_alias:string;
	c_contact:string;
	c_alt_no:string;
	c_email:string;
	c_country:string;
	c_notes:string;
	c_street:string;
	c_city:string;
	c_state:string;
	c_zipcode:string;
	c_filing_cm:string;
	c_cm_assigned:string;
	c_defendent_name:string;
	c_defendent_alias:string;
	c_defendent_manager:string;
	c_reg_fee:string;
	c_decided_fee:string;

	advocate_list:any;


	constructor(public apiValue:ApiValuesProvider,public navCtrl: NavController, public navParams: NavParams,public formBuilder: FormBuilder, public alertCtrl: AlertController,public toastCtrl: ToastController,  private http: Http,  public loading: LoadingController)
	{
		this.c_date=new Date(); //Assigning it to today's date
	}


	isValid(email) 
    {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
	}

	isValidName(name)
	{
		var re=/^[A-Za-z]+$/;
		return re.test(String(name));
	}
	makeAlertDialog(message)
	{
		let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:message,

			buttons: ["OK"]

			});

			alert.present();

	}
	
	submitData()
	{

		if(this.c_case_type==null)
		{
			this.makeAlertDialog('Please select a case type');

			return; //exit from the function
		}

		//Following lines will execute if the above "if" statement is not entered

		if(this.c_alien_no==null || this.c_alien_no.length==0)
		{
			this.makeAlertDialog('Alien No. cannot be empty');

			return; //exit from the function
		}

		if(this.c_case_category==null)
		{
			this.makeAlertDialog('Please select a case category');

			return; //exit from the function
		}

		//Following lines will execute if the above "if" statement is not entered

		if(this.c_date==null)
		{
			this.makeAlertDialog('Please select a date');

			return; //exit from the function
		}

		if(this.c_name==null|| this.isValidName(this.c_name)==false)
		{
			this.makeAlertDialog('Client name is empty or invalid');

			return; //exit from the function
		}

		if(this.c_contact==null||this.c_contact.length!=10)
		{
			this.makeAlertDialog('Enter a valid 10 digit contact number');

			return; //exit from the function
		}

		if(this.c_alt_no!=null && this.c_alt_no.length!=10)
		{
			this.makeAlertDialog('Enter a valid 10 digit Alternative number');

			return; //exit from the function
		}


		//Following lines will execute if the above "if" statement is not entered

		if(this.c_email==null || this.isValid(this.c_email)==false)
		{
			this.makeAlertDialog('Email is invalid');

			return; //exit from the function
		}

		if(this.c_street==null||this.c_street.length==0)
		{
			this.makeAlertDialog('Street name cannot be empty');

			return; //exit from the function
		}
		
		if(this.c_city==null||this.c_city.length==0)
		{
			this.makeAlertDialog('City cannot be empty');

			return; //exit from the function
		}

		if(this.c_state==null||this.c_state.length==0)
		{
			this.makeAlertDialog('State cannot be empty');

			return; //exit from the function
		}

		if(this.c_zipcode==null||this.c_zipcode.length==0)
		{
			this.makeAlertDialog('Zipcode cannot be empty');

			return; //exit from the function
		}

		if(this.c_country==null||this.c_country.length==0)
		{
			this.makeAlertDialog('Country cannot be empty');

			return; //exit from the function
		}

		if(this.c_cm_assigned==null||this.c_cm_assigned.length==0)
		{
			this.makeAlertDialog('Contact number cannot be empty');

			return; //exit from the function
		}

		if(this.c_defendent_name==null||this.isValidName(this.c_defendent_name))
		{
			this.makeAlertDialog('Defendent name is invalid');

			return; //exit from the function
		}

		if(this.c_contact==null|| this.c_contact.length!=10)
		{
			this.makeAlertDialog('Please enter a valid Defendent contact ');

			return; //exit from the function
		}

		//Following lines will execute only if the form fields are correct
		
		var headers = new Headers();

	       headers.append("Accept", "application/json");

	       headers.append("Content-Type", "application/json" );

	       let options = new RequestOptions({ headers: headers });

	  
	       /*
	       let data = { //Data to be sent to the server

	            case_type:this.c_case_type,
			    case_no:this.c_alien_no,
			    case_category:this.c_case_category,
			    adv_assign:this.c_cm_assigned,
			    op_full_name:,
			    full_name:[Aakash Chaudhary],
			    p_streetNoName:[GulmoharStreet No-2],
			    p_city:[jkljkljljkj],
			    p_state:[kjkkljkjlj],
			    p_pin_code:[78656],
			    p_country:[United States],
			    client_group:ENTITY,
			    filing_adv_name:,
			    client_type:Test1,
			    case_desc:dummy text,
			    op_alias:[],
			    op_adv_name:,
			    registration_fee:20000,
			    decided_fee:10000,
			    alias:[],
			    contact:[9599104387],
			    alternate_number:[9599104387],
			    email:[aakashchaudhary@gamil.com],
			    notes:[dummy text],
			    b_state:[jkljkljljkj],
			    b_city:[kjkkljkjlj],
			    b_pin_code:[78656],
			    b_streetNoName:[Gali no-3, Sector-43],
			    relationship:[]
	         };
	         */

	         let data={

	         };
			let loader = this.loading.create({

			   content: "Adding client please wait…",

			 });

		   loader.present().then(() => 
			{

		   this.http.post(this.apiValue.baseURL+"/add_client",data,options) //Http request returns an observable

		   .map(response => response.json()) ////To make it easy to read from observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
					  
				{ 
			   			console.log(serverReply);
			   			loader.dismiss();
				      

				   });

	  		 });
	}

	getCaseManagerList()
	{
		this.advocate_list=[];

		var headers = new Headers();

	       headers.append("Accept", "application/json");

	       headers.append("Content-Type", "application/json" );

	       let options = new RequestOptions({ headers: headers });

	       let data=
	       {

	         };
			let loader = this.loading.create({

			   content: "Getting info. please wait…",

			 });

		   loader.present().then(() => 
			{

		   this.http.post(this.apiValue.baseURL+"/get_advocate",data,options) //Http request returns an observable

		   .map(response => response.json()) ////To make it easy to read from observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
					  
				{ 
			   			console.log(serverReply);
			   			loader.dismiss();

			   			//this.advocate_list=serverReply;
				      
				   });

	  		 });
	}
}