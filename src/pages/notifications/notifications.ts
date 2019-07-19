import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import {Http, Headers, RequestOptions}  from "@angular/http";
import { ToastController } from 'ionic-angular';
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import { Events } from 'ionic-angular';

import { NotificationDetailsComponent } from '../../components/notification-details/notification-details';

import { ApiValuesProvider } from '../../providers/api-values/api-values';

import { AddNotificationPage } from './new_format/add_notification/add_notification';
import { NotificationListPage } from './new_format/notification_list/notification_list';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class NotificationsPage 
{
	n_from:string;
	n_to:string;
	n_search:string;
	notifications:any;

  setDetailVisible: boolean;
  detailNotification: any;
  blurAmount: string;

  constructor
    (
      public modalCtrl: ModalController,
    public events: Events,
    public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController
  )
	{
		this.fetchData();
        
    }

    searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
    }

  hideDetails() {
    this.setDetailVisible = false;
    this.blurAmount = '';
  }

  showDetails(notification)
  {
    /*
    if (this.setDetailVisible == true)
    {
      //Already Visible

      //Set it to false so that the div hides and don't do anything
      this.hideDetails();
      return;
    }


    this.setDetailVisible = true;
    this.blurAmount = 'blurDiv';
    this.detailNotification = notification;
    */
    let data = {
      notification: notification
    }
    const modal = this.modalCtrl.create(NotificationDetailsComponent, data);

    modal.present();
    this.blurAmount = 'blurDiv';
    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
    });

  }


	fetchData()
	{
	
	   var headers = new Headers();
	   this.notifications=[];

       headers.append("Accept", "application/json");

       headers.append("Content-Type", "application/json" );

       let options = new RequestOptions({ headers: headers });

  

       let data = { //Data to be sent to the server

           from_date:this.n_from,
		   to_date:this.n_to,
		   search:this.n_search
         };

		let loader = this.loading.create({

		   content: "Getting data please wait…",

		 });

	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/notification",data,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   			console.log(serverReply);
		   			loader.dismiss();
		   
		   			if('message' in serverReply) //incorrect login
					{
					
						
						const toast = this.toastCtrl.create({
							  message: serverReply.message,
							  duration: 5000
							});
							toast.present();
					}
		   			else
						{
							 this.notifications=serverReply;
						}
				 
			      

			   });

  		 });
		

    }

  addNotification()
  {
    this.navCtrl.push(AddNotificationPage);
  }

  notificationList()
  {
    this.navCtrl.push(NotificationListPage);
  }
   
}
