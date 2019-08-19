import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, ToastController, LoadingController, NavController } from 'ionic-angular';

import { ApiValuesProvider } from '../../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../../providers/my-storage/my-storage';

import { User } from '../../../../../models/login_user.model';
import { CaseHistory } from '../../../../../models/client_case_history.model';

@Component({
  selector: 'add_case_history',
  templateUrl: 'add_case_history.html'
})
export class AddCaseHistoryPage
{
  
  note = '';
  clientId = '';
  maxCharacters = 1000; //maximum length of the note

  isAddMode: boolean = true; //TRUE For adding new case history and FALSE for updating case history
  passedCaseHistory: CaseHistory;

  loggedInUser: User;


  constructor
    (public navParams: NavParams,
      public apiValues: ApiValuesProvider,
      public myStorage: MyStorageProvider,
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController,
    public http: Http,
    public navCtrl: NavController
    )
  {
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad()
  {
    //Called after the view has been loaded. Safe to get parameters

    console.log('In Ion VIew Did Load');
    this.clientId = this.navParams.get('client_id');
    this.isAddMode = this.navParams.get('isAddMode');
    if (!this.isAddMode)
    {
      //Update mode
      this.passedCaseHistory = this.navParams.get('case_history');
      console.log('------Case History Received-------');
      console.log(this.passedCaseHistory);
      this.note = this.passedCaseHistory.case_history;
    }
  }

  addNote()
  {
    if (this.note == null || this.note.length == 0)
    {
      this.showToast('Case History cannot be empty');
    }
    else
    {
     
      const loader = this.loadingCtrl.create({

        content: (this.isAddMode?'Adding...':'Updating...'),
        duration: 15000
      });
      let loadingSuccessful = false;//To know whether timeout occured or not

      loader.present().then(() =>
      {

        let body = new FormData();

        body.set('notes', this.note);
        body.set('cid', this.clientId);
        body.set('session_id', this.loggedInUser.id);
       
        
        let pageName = '/add_case_history.php';
        if (!this.isAddMode)
        {
          //Update Mode
          pageName = '/update_client_case_history.php';
          body.set('rowId', this.passedCaseHistory.id);
        }

        this.http.post(this.apiValues.baseURL + pageName, body, null)
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

                  return;
                }
                else
                {
                  //Success
                  this.showToast(data.message);
                  this.navCtrl.getPrevious().data.reload = true;
                  this.navCtrl.getPrevious().data.caseHistory = true;
                  this.navCtrl.pop();

                  return;
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

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }
}
