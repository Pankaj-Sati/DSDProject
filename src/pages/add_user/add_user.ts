import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import {DashboardPage} from '../dashboard/dashboard';

import {ApiValuesProvider} from '../../providers/api-values/api-values';

@Component({
  selector: 'page-add_user',
  templateUrl: 'add_user.html'
})

export class AddUserPage 
{
	u_name: string;
	u_email: string;
	u_contact: string;
	u_alt: string;
	u_gender: string;
	u_dob: string;
	u_country: string;
	u_state: string;
	u_city: string;
	u_pincode: string;
	u_fax: string;
	u_street: string;
	u_street_name: string;
	u_apartment: string;
	u_user_type: string;


	constructor(public apiValue:ApiValuesProvider,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController,public storage: Storage, public menuCtrl: MenuController) 
	{
		this.menuCtrl.enable(true);
		this.menuCtrl.swipeEnable(true);

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

	submitData()
	{

		//Validating data

		if(this.u_name==null || this.isValidName(this.u_name)==false)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"Name is empty or invalid",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		//Following lines will execute if the above "if" statement is not entered

		if(this.u_email==null || this.isValid(this.u_email)==false)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"Email is not valid",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_contact==null || this.u_contact.length!=10)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"Enter a valid 10 digit contact No.",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_alt!=null && this.u_alt.length!=10)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"Enter a valid 10 digit Alternative No.",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_gender==null || this.u_gender.length==0)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"Gender not selected",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_dob==null || this.u_dob.length==0)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"Date of Birth is empty",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_country==null || this.u_country.length==0)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"Country cannot be  empty",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_state==null || this.u_state.length==0)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"State name cannot be  empty",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_city==null || this.u_city.length==0)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"City cannot be  empty",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_pincode==null ||this.u_pincode.length==0)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"ZipCode cannot be  empty",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}

		if(this.u_user_type==null || this.u_user_type.length==0)
		{
			let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:"User Type not selected",

			buttons: ["OK"]

			});

			alert.present();

			return; //exit from the function
		}


		//The following code will run only if the details entered are valid

		
		var headers = new Headers();

	  

	   let options = new RequestOptions({ headers: headers });



	   /* let data = {

		    full_name: this.u_name,
			email: this.u_email,
			contact: this.u_contact,
			alt: this.u_alt,
			gender: this.u_gender,
			date_of_birth: this.u_dob,
			country: this.u_country,
			state: this.u_state,
			city: this.u_city,
			pincode: this.u_pincode,
			fax: this.u_fax,
			street: this.u_street,
		   	street_name: this.u_street_name,
			apartment: this.u_apartment,
			user_type: this.u_user_type,
		    profile_image:'shabnam_saifi.jpg'

		 };
		 */
		let body = new FormData();
		body.append("full_name",this.u_name);
		body.append("email",this.u_email);
		body.append("contact",this.u_contact);
		body.append("alt",this.u_alt);
		body.append("gender",this.u_gender);
		body.append("date_of_birth",this.u_dob);
		body.append("country",this.u_country);
		body.append("state",this.u_state);
		body.append("city",this.u_city);
		body.append("pincode",this.u_pincode);
		body.append("fax",this.u_fax);
		body.append("street",this.u_street);
		body.append("street_name",this.u_street_name);
		body.append("apartment",this.u_apartment);
		body.append("user_type",this.u_user_type);
		body.append(" profile_image",'shabnam_saifi.jpg');
		
		/* body.append("full_name","Sudhanshu");
		body.append("email","ghsan@gmail.com");
		body.append("contact",9897367892);
		body.append("alt",9872658974);
		body.append("gender","Male");
		body.append("date_of_birth","2000-10-10");
		body.append("country",321);
		body.append("state","saddsd");
		body.append("city","sdwiewqmsd");
		body.append("pincode",76787);
		body.append("fax",8626756389);
		body.append("street",34);
		body.append("street_name","Kamal Namgew");
		body.append("apartment","Unisd wewq");
		body.append("user_type",2);
		body.append(" profile_image",'shabnam_saifi.jpg'); 
		
				console.log("PRinting Body");
		console.log(body); 
		*/
		let loader = this.loading.create({

		   content: "Adding user please wait…",

		 });
		
		loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/add_user",body,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   		
		   		loader.dismiss()
				
				console.log(serverReply);
		   	
		   		const toast = this.toastCtrl.create({
							  message: serverReply.message,
							  duration: 3000
							});
							toast.present();
			 
		   		if('code' in serverReply && serverReply.code==200) 
					{
						//Successfully created user
						this.navCtrl.setRoot(DashboardPage);
					}
			   });

  		 });
	}

	

}