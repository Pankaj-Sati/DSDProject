import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LogoutPage } from '../logout/logout';
import { ChangePasswordPage } from './change_password/change_password';
import { EditProfilePage } from './edit_profile/edit_profile';

import {ApiValuesProvider} from '../../providers/api-values/api-values';

@Component({
  selector: 'user_profile',
  templateUrl: 'user_profile.html'
})
export class UserProfilePage 
{

	U_NAME="name";
	U_EMAIL="email";
    U_PROFILEIMG="profile_img";
   
   u_name: string;
   u_email:string;
   u_image: string;

	constructor(public apiValue:ApiValuesProvider,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  public loading: LoadingController,public toastCtrl: ToastController,public storage: Storage, public menuCtrl: MenuController) 
	{

        this.getLocalData();
    }

    getLocalData()
    {
    	this.storage.get(this.U_NAME).then((value) => 
			  {
					
				  this.u_name=value;
		  		  
			  });
	  
	  this.storage.get(this.U_EMAIL).then((value) => 
			  {
					
				  this.u_email=value;
		  		
			  });
	  
	  this.storage.get(this.U_PROFILEIMG).then((value) => 
			  {
					
				  this.u_image=this.apiValue.baseImageFolder+value;
		  		  
			  });
  }

  userLogout()
  {
  		this.navCtrl.setRoot(LogoutPage);
  }

  changePassword()
  {
        let data={

          image:this.u_image
        };
  	    this.navCtrl.push(ChangePasswordPage,data);
  }

  viewProfile()
  {
  		this.navCtrl.push(EditProfilePage);
  }

}