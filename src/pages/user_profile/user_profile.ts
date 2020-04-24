import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LogoutPage } from '../logout/logout';
import { ChangePasswordPage } from './change_password/change_password';
import { ViewProfilePage } from './view_profile/view_profile';

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';

import { ViewImageComponent} from '../../components/view-image/view-image';

import { Events } from 'ionic-angular';

import {User } from '../../models/login_user.model';

@Component({
  selector: 'user_profile',
  templateUrl: 'user_profile.html'
})
export class UserProfilePage 
{
  loggedInUser: User;
   u_name: string;
   u_email:string;
   u_image: string;

  constructor(public events:Events,public myStorage: MyStorageProvider, public apiValue: ApiValuesProvider, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loading: LoadingController, public toastCtrl: ToastController, public storage: Storage, public menuCtrl: MenuController) 
	{

    this.getLocalData();
    
    }

    getLocalData()
    {
      this.loggedInUser = this.myStorage.getParameters();

      this.u_name = this.loggedInUser.name;
      this.u_email = this.loggedInUser.email;
      console.log("User Profile");
      console.log(this.loggedInUser);
      this.u_image = this.apiValue.baseImageFolder + this.loggedInUser.profile_img;
		  		  
	
    }

  searchClient()
  {
    this.events.publish('mainSearch', 'ds'); //This event is defined in app.component.ts file
  }


  userLogout()
  {
  		this.navCtrl.setRoot(LogoutPage);
  }

  changePassword()
  {
       
  	    this.navCtrl.push(ChangePasswordPage);
  }

  viewProfile()
  {
    this.navCtrl.push(ViewProfilePage);
  }

  viewImage(image)
  {
    let data =
    {
      imageURL: image
    };

    this.navCtrl.push(ViewImageComponent,data);
  }

}
