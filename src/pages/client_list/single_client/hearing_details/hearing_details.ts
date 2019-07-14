import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, NavController } from 'ionic-angular';
import { LoadingController, ToastController, ViewController, AlertController, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { User } from '../../../../models/login_user.model';
import { DatewiseHearing } from '../../../../models/client_hearing.model';
import { ClientDetails, Client } from '../../../../models/client.model';

import { EditClientHearingComponent } from '../../../../components/edit-client-hearing/edit-client-hearing';
import { AddClientHearingComponent } from '../../../../components/add-client-hearing/add-client-hearing';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';


@Component({
  selector: 'hearing_details',
  templateUrl: 'hearing_details.html'
})
export class HearingDetailsPage
{
  passedClientDetails: ClientDetails;
  passedClient: Client;
  loggedInUser: User;

  hearing_list: DatewiseHearing[] = [];
  showAddHearing: boolean = false;

  constructor
    (
    public inAppBrowser: InAppBrowser,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
      public navParams: NavParams,
      public navCtrl: NavController,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public apiValues: ApiValuesProvider,
      public myStorage: MyStorageProvider,
      public viewCtrl: ViewController,
      public http: Http)
  {
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad()
  {
    this.passedClientDetails = this.navParams.get('clientdetails');
    this.passedClient = this.navParams.get('client');
    this.fetchData();
  }


  fetchData()
  {
    this.hearing_list = [];
    let loader = this.loadingCtrl.create({

      content: "Loading...",
      duration: 15000

    });

    let loadingSuccessful = false;//To know whether loading timeout happened or not

    let body = new FormData();
    body.append('cid', String(this.passedClient.id));

    console.log('Fetching For client ID=' + this.passedClient.id);
    loader.present().then(() => 
    {

      this.http.get(this.apiValues.baseURL + "/display_datewise_hearing_details.php?cid=" + this.passedClient.id) //Http request returns an observable

        .subscribe(response =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          console.log(response);
          loadingSuccessful = true;
          console.log(response);
          loader.dismiss();

          if (response)
          {
            try
            {
              let serverReply = JSON.parse(response['_body']);

              if ('code' in serverReply) //incorrect login
              {
                //Failure Returned
                this.presentToast(serverReply.message);
                this.checkForAddHearing();
              }
              else
              {
                //Success
                this.hearing_list = serverReply;
                this.checkForAddHearing();
              }
            }
            catch (err)
            {
              this.presentToast("Failed to load data ");
            }


          }
          else
          {
            this.presentToast("Failed to load data ");
          }

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            this.presentToast("Failed to load data");
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentToast("Timeout!!! Server did not respond ");
      }
    });
  }

  presentToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });

    toast.present();
  }

  viewDoc(docName)
  {
    let docUrl = this.apiValues.baseFileUploadFolder + docName;
    this.inAppBrowser.create(docUrl, "_system"); //_system for opening the document in the default system browser
  }

  deleteHearingAlert(hearing: DatewiseHearing)
  {
    const alert = this.alertCtrl.create(
      {
        title: 'Attention!',
        message: 'Do you want to delete this hearing?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            
          },
          {
            text: 'Delete',

            handler: () => { this.deleteHearing(hearing); }

          }
        ]

      });
    alert.present();
  }

  deleteHearing(hearing: DatewiseHearing)
  {
    //http://myamenbizzapp.com/dsd/api_work/delete_hearing.php?cid=42
    //& delete_hearing_id=20 & session_id=1

    let loader = this.loadingCtrl.create({

      content: "Deleting...",
      duration: 15000

    });

    let loadingSuccessful = false;//To know whether loading timeout happened or not

    /*
    let body = new FormData();
    body.append('cid', String(this.passedClient.id));
    body.append('delete_hearing_id', hearing.id);
    body.append('session_id', this.loggedInUser.id);
    */
    console.log('Deleting For client ID=' + this.passedClient.id);
    console.log('Deleting For Haring ID=' + hearing.id);

    loader.present().then(() => 
    {

      this.http.get(this.apiValues.baseURL + "/delete_hearing.php?cid=" + this.passedClient.id + "&delete_hearing_id=" + hearing.id + "&session_id=" + this.loggedInUser.id) //Http request returns an observable

        .subscribe(response =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          console.log(response);
          loadingSuccessful = true;
          console.log(response);
          loader.dismiss();

          if (response)
          {
            try
            {
              let serverReply = JSON.parse(response['_body']);

              if ('code' in serverReply ) //incorrect login
              {
                this.presentToast(serverReply.message);
                if (serverReply.code == 200)
                {
                  this.fetchData();
                }
              
              }
              else
              {
                //Failure
                this.presentToast("Failed to delete Hearing ");
              }
            }
            catch (err)
            {
              this.presentToast("Failed to delete Hearing ");
            }


          }
          else
          {
            this.presentToast("Failed to delete Hearing");
          }

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);
            this.presentToast("Failed to delete Hearing");
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentToast("Timeout!!! Server did not respond ");
      }
    });

  }

  editHearing(hearing)
  {
    let data =
    {
      client: this.passedClient,
      hearing: hearing
    };
    const modal = this.modalCtrl.create(EditClientHearingComponent, data);
    modal.present();

    modal.onDidDismiss(() =>
    {
      this.fetchData();
    });
  }

  checkForAddHearing()
  {
    let showAdd: boolean = true;
    for (let i = this.hearing_list.length-1; i>=0; i--)
    {
      if (this.hearing_list[i].hearing_disc == null ||
        this.hearing_list[i].hearing_disc == undefined ||
        this.hearing_list[i].hearing_disc.length == 0)
      {
        //Hearing is not finished for any one of the hearings. So we can't add a new hearing
        showAdd = false;
        this.showAddHearing = false;
        return; //Don't continue looping
      }
    }

    this.showAddHearing = showAdd; //Whatever the final value of showAdd is


  }

  addHearing()
  {
    let data =
    {
      client: this.passedClient
    };
    const modal = this.modalCtrl.create(AddClientHearingComponent, data);
    modal.present();

    modal.onDidDismiss(() =>
    {
      this.fetchData();
    });
  }

}



