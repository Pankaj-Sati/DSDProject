import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { AddReminderPage} from '../add_reminder/add_reminder';

import { NewReminder } from '../../../../models/reminder.model';
import { User } from '../../../../models/login_user.model';

@Component({
  selector: 'reminder_list',
  templateUrl:'reminder_list.html'
})
export class ReminderListPage
{
  reminderList: NewReminder[] = [];
  visibility: boolean[] = [];

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
    if (this.navParams.data.reload)
    {
      this.fetchData();
    }
  }

  searchClient()
  {
    this.events.publish('mainSearch', 'ds'); //This event is defined in app.component.ts file
  }

  fetchData()
  {

    var headers = new Headers();
    this.reminderList = [];
    this.visibility = [];

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

      this.http.post(this.apiValue.baseURL + "/remindersList.php", body, null) //Http request returns an observable

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
            this.reminderList = serverReply;
            for (let i = 0; i < this.reminderList.length; i++)
            {
              this.visibility[i] = false;
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

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  showDetails(notification, $event, i)
  {
    
    this.visibility[i] = !this.visibility[i];
  }

  addReminder()
  {
    this.navCtrl.push(AddReminderPage);
  }

  deleteReminderAlert(reminder: NewReminder)
  {
    const alert = this.alertCtrl.create(
      {
        message: 'Delete this note?',
        title: 'Attention!',
        buttons: [{

          text: 'Confirm',
          handler: () =>
          {
            console.log("Delete  Confirm");
            this.deleteReminder(reminder);
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

  deleteReminder(reminder: NewReminder)
  {
    const loader = this.loading.create({

      content: 'Deleting...',
      duration: 15000
    });
    let loadingSuccessful = false;//To know whether timeout occured or not

    loader.present().then(() =>
    {
      //http://dsdlawfirm.com/dsd/api_work/delete_reminder.php?session_id=1&rowId=2

      let body = new FormData();

      body.set('rowId', reminder.id);

      body.set('session_id', this.loggedInUser.id);

      this.http.post(this.apiValue.baseURL + '/delete_reminder.php', body, null)
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

}
