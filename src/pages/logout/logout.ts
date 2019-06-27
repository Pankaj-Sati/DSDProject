import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';


import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})
export class LogoutPage 
{
	U_ID="id";
	U_NAME="name";
	U_EMAIL="email";
	U_USERTYPEID="usertype_id";
	U_PROFILEIMG="profile_img";


	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  public loading: LoadingController,public storage: Storage, public menuCtrl: MenuController,public toastCtrl: ToastController)
	{
		this.removeData();
        
    }

 
	removeData()
	{
		let loader = this.loading.create({

		   content: "Loging out please wait…",

		 });

	   loader.present().then(() => 
		{
		   			this.storage.remove(this.U_ID);
		  			this.storage.remove(this.U_NAME);
		  			this.storage.remove(this.U_EMAIL);
		  			this.storage.remove(this.U_USERTYPEID);
		  			this.storage.remove(this.U_PROFILEIMG);
						console.log('Data removed');
					this.navCtrl.setRoot(LoginPage);
	   		loader.dismiss();
		   
	   	});
							 

    }
	
}