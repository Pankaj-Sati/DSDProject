import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";
import { LoginPage } from '../../login/login';
import { Storage } from '@ionic/storage';

import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../providers/my-storage/my-storage';
import { CountryProvider } from '../../../providers/country/country';

import {EditProfilePage } from '../edit_profile/edit_profile';

import { User, UserDetails } from '../../../models/login_user.model';
import { ViewImageComponent } from '../../../components/view-image/view-image';
import { FrontPage } from '../../front/front';

@Component({
	selector: 'view_profile',
	templateUrl:'view_profile.html'
})

export class ViewProfilePage 
{
	u_id=null;
  USER_ID = "id";
  user: UserDetails;

  loggedInUser: User;


  constructor(public country: CountryProvider,
    public myStorage: MyStorageProvider,
    public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public menuCtrl: MenuController) 
	{

    this.getUserId(); //We will fetch the user id from local storage which we saved at the time of login
    this.fetchData();    
  }



    fetchData()
    {
      console.log("User ID to fetch is=" + this.loggedInUser.id);

      if (this.loggedInUser != null)
    		{
    				//This means that the user_id was fetched successfully
 
            var headers = new Headers();
           
        /*
              let data = {

                mode: 'view',

                session_user_id: this.loggedInUser.id

              };

        */
            let body = new FormData();
            body.append('mode', 'view');
            body.append('session_user_id', this.loggedInUser.id);
		
            let options = new RequestOptions({ headers: headers });

            let loader = this.loading.create({

              content: "Loading ...",
              duration:15000

            });

           let loadingSuccessful = false; // To tell whether loading went successful or not
            

	         loader.present().then(() => 
		      {

	         this.http.post(this.apiValue.baseURL+"/profile.php",body,options) //Http request returns an observable

           .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				    { 
               console.log('Server Reply');

               console.log(serverReply);
               loadingSuccessful = true;
		   			   loader.dismiss();

             if (serverReply)
             {
               let response = JSON.parse(serverReply['_body']);

               if ("message" in response)
               {
                 //Indicates error message sent by the server

                 this.presentToast(response.message);

               }
               else
               {
                 this.user = response;
               }
             }
             else
             {
               this.presentToast('Failed to get data');
               loader.dismiss();
             }

             }, error =>
             {
                 loadingSuccessful = true;
                 console.log(error);
                 this.presentToast('Failed to get data');
                 loader.dismiss();
             });

             });

        loader.onDidDismiss(() =>
        {
          if (!loadingSuccessful)
          {
            this.presentToast('Error!!! Server Did Not Respond');
          }
        });
            
    	}
    	else
    	{ //If user id cannot be loaded from the local storage, then we cannot view profile
        this.presentToast('User not found. Please Login again');
        this.navCtrl.setRoot(FrontPage); //Take user to the login page
    	}	
    }


  getCountryName(id)
  {
   // return this.country.getCountryName(id);
    return id;
  }

    getUserId()
    {
      this.loggedInUser = this.myStorage.getParameters();
    }

  editProfile()
  {
    let data = {
      userDetail: this.user,
      user_id: this.loggedInUser.id
    };
    this.navCtrl.push(EditProfilePage,data);
  }

  goBack()
  {
    this.navCtrl.pop();
  }

  presentToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();	
  }

  ionViewDidEnter()
  {
    if (this.navParams.data.reload)
    {
      this.fetchData();
    }
  }

  viewImage(image)
  {
    let data =
    {
      imageURL: this.apiValue.baseImageFolder+image
    };

    this.navCtrl.push(ViewImageComponent, data);
  }
}
