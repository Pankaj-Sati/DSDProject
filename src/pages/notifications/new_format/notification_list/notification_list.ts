import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { AddNotificationPage} from '../add_notification/add_notification';
import { NewNotification } from '../../../../models/notification.model';
import { User } from '../../../../models/login_user.model';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'notification_list',
  templateUrl:'notification_list.html'
})
export class NotificationListPage
{
  notificationList: NewNotification[] = [];
  visibility: boolean[] = [];
  isStatusChanging: boolean[] = [];

  from_date = '';
  to_date = '';
  search_string = '';

  loggedInUser: User;

  constructor(public events: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public apiValue: ApiValuesProvider,
    public menuCtrl: MenuController,
    public myStorage: MyStorageProvider)
  {

    this.loggedInUser = this.myStorage.getParameters();
    this.fetchData();
  }
  

  ionViewDidEnter()
  {
    console.log('Ion view did enter');
    if (this.navParams.data.reload)
    {
      this.fetchData();
    }
  }

  fetchData()
  {

    var headers = new Headers();
    this.notificationList = [];
    this.visibility = [];
    this.isStatusChanging = [];

    headers.append("Accept", "application/json");

    headers.append("Content-Type", "application/json");

    let options = new RequestOptions({ headers: headers });
    let body = new FormData();
    body.set('session_id', this.loggedInUser.id);
    body.set('from_date', this.from_date);
    body.set('to_date', this.to_date);
    body.set('search', this.search_string);

    let loader = this.loading.create({

      content: "Loading ...",
      duration: 15000

    });
    let loadingSuccessful = false;//To know whether timeout occured or not
    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/notificationList.php", body, null) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          console.log(serverReply);
          loader.dismiss();

          if ('message' in serverReply || 'code' in serverReply)
          {
            this.showToast(serverReply.message)
          }
          else
          {
            this.notificationList = serverReply;
            for (let i = 0; i < this.notificationList.length; i++)
            {
              this.visibility[i] = false;
              this.isStatusChanging[i] = false;
            }
          }



        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);

            this.showToast('Error in getting data');
            loader.dismiss();

          });

    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.showToast('Timeout!!! Server did not respond');
      }
    });


  }

  showToast(text,duration=3000)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: duration
    });
    toast.present();
  }

  showDetails(notification: NewNotification, $event, i)
  {
   
    if (Number(this.loggedInUser.user_type_id) == 5 && notification.is_read == 'N' && !this.visibility[i]) //Change read status when current user is a client and visibility is hidden and read status is 'N'
    {
      this.changeReadStatus(notification, true);
    }
    
    this.visibility[i] = !this.visibility[i];
   
    
  }

  addNotification()
  {
    this.navCtrl.push(AddNotificationPage);
  }

  deleteNotificationAlert(notification: NewNotification)
  {
    const alert = this.alertCtrl.create(
      {
        message: 'Delete this notification for client?',
        title: 'Attention!',
        buttons: [{

          text: 'Confirm',
          handler: () =>
          {
            console.log("Delete  Confirm");
            this.deleteNotification(notification);
          }

        },
        {
          text: "Cancel",
          handler: () =>
          {
            console.log("Delete Cancelled");
          }
        }
        ],

      });
    alert.present();

  }

  deleteNotification(notification: NewNotification)
  {
    const loader = this.loading.create({

      content: 'Deleting...',
      duration: 15000
    });
    let loadingSuccessful = false;//To know whether timeout occured or not

    loader.present().then(() =>
    {
      //http://dsdlawfirm.com/dsd/api_work/delete_notification.php?session_id=1&rowId=2

      let body = new FormData();

      body.set('rowId', notification.id);
    
      body.set('session_id', this.loggedInUser.id);

      this.http.post(this.apiValue.baseURL + '/delete_notification.php', body, null)
        .subscribe(response =>
        {
          console.log(response);
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            try
            {
              let data = JSON.parse(response['_body']);
              if (('code' in data) && data.code > 400)
              {
                //error
                this.showToast(data.message);
              }
              else
              {
                //Success
                this.showToast(data.message);
                this.fetchData();

              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!!');
            }
          }
          else
          {

            this.showToast('Failure!!!');
          }

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            loader.dismiss();
          });
    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Failure!!! Server did not respond');
      }
    });

  }

  changeReadStatus(notification: NewNotification, isRead: boolean)
  {
    console.log('inChange Read Status For Notification:');
    console.log(notification);
    let notificationIndex = this.notificationList.findIndex(eachNotification => eachNotification.id == notification.id);
    if (notificationIndex != undefined && notificationIndex >= 0)
    {
      this.isStatusChanging[notificationIndex] = true;
    }
    timer(15000).subscribe(() =>
    {
      this.isStatusChanging[notificationIndex] = false; //If the timer expires, we will forcefully stop showing the spinner
    });

    let body = new FormData();
    body.set('session_id', this.loggedInUser.id);
    body.set('n_id', notification.id);
    body.set('n_is_read', isRead ? 'Y' : 'N');
    this.http.post(this.apiValue.baseURL + '/change_notification_read_status.php', body)
      .subscribe(response =>
      {
        console.log(response);
        this.isStatusChanging[notificationIndex] = false;
        if (response)
        {
          try
          {
            let result = JSON.parse(response['_body']);
            if ('code' in result && result.code == 200)
            {
              //Success
              notification.is_read = result.read;
              if (result.read == 'Y')
              {
                this.showToast('Marked as read',1000);
              }
              else
              {
                this.showToast('Marked as unread', 1000);
              }
              
            }
            else
            {
              //Failure
              this.showToast('Unable to mark read', 1000);
            }
          }
          catch (err)
          {
            console.log(err);
            this.showToast('Unable to mark read', 1000);

          }
        }
        else
        {
          this.showToast('Unable to mark read', 1000);
          
        }
      }, error =>
        {
          this.isStatusChanging[notificationIndex] = false;
          console.log(error);
          this.showToast('Unable to mark read', 1000);
        });

   
  }
 
}
