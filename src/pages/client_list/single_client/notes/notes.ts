import { Component } from '@angular/core';
import { Events, NavParams } from 'ionic-angular';
import { LoadingController, ToastController, NavController, NavOptions, AlertController } from 'ionic-angular';
import { Http } from "@angular/http";

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { AddNotesPage } from './add_notes/add_notes';
import { AddCaseHistoryPage } from './add_case_history/add_case_history';

import { ClientNote } from '../../../../models/client_notes.model';
import { CaseHistory } from '../../../../models/client_case_history.model';
import { User } from '../../../../models/login_user.model';


@Component({
  selector: 'notes',
  templateUrl: 'notes.html'
})

export class NotesListPage
{
  notes_list: ClientNote[] = [];
  case_history_list: CaseHistory[] = [];
  noteDetail: ClientNote;
  passed_client_id;
  loggedInUser: User;

  n_search: string = '';//Search string for notes
  c_search: string = '';//Search string for case history

  visibilityNotes: boolean[] = []; //For changing detailed visibility of each note
  visibilityCaseHistory: boolean[] = []; //For changing detailed visibility of each case history

  public showCaseHistory: boolean = true;
  public showNotes: boolean = false;


  constructor
    (
      public events: Events,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public http: Http,
      public apiValues: ApiValuesProvider,
      public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public myStorage: MyStorageProvider
 
    )
  {
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad()
  {
    console.log('Client Notes: ionViewDidLoad');
    
    this.passed_client_id = this.navParams.get('client_id');

    console.log('Client Id Received:' + this.passed_client_id);
    this.fetchData();
    this.fetchCaseHistoryData();
  }

  ionViewDidEnter()
  {
    console.log('---Ion View Did Enter---');
    if (this.navParams.data.reload && this.navParams.data.caseHistory)
    {
      this.fetchCaseHistoryData();
    }

    if (this.navParams.data.reload && this.navParams.data.caseHistory==undefined)
    {
      this.fetchData();
    }
  }

  showDetails(smsSelected, showEvent, i)
  {
    this.visibilityNotes[i] = !this.visibilityNotes[i];
  }

  showCaseHistoryDetails(caseHistorySelected, showEvent, i)
  {
    this.visibilityCaseHistory[i] = !this.visibilityCaseHistory[i];
  }

  fetchData()
  {

    this.notes_list = [];
    this.visibilityNotes = [];

    const loader = this.loadingCtrl.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('cid', this.passed_client_id);
      body.append('search', this.n_search);

      this.http.post(this.apiValues.baseURL + "/view_client_notes.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                this.showToast(data.message);
                return;
              }
              else
              {
                this.notes_list = data;
                for (let i = 0; i < this.notes_list.length; i++)
                {
                  this.visibilityNotes[i] = false;
                }

              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Error!!! Server did not respond');
      }

    });

  }

  fetchCaseHistoryData()
  {

    this.case_history_list = [];
    this.visibilityCaseHistory = [];

    const loader = this.loadingCtrl.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('cid', this.passed_client_id);
      body.append('search', this.c_search);

      this.http.post(this.apiValues.baseURL + "/view_client_case_history.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                this.showToast(data.message);
                return;
              }
              else
              {
                this.case_history_list = data;
                for (let i = 0; i < this.case_history_list.length; i++)
                {
                  this.visibilityCaseHistory[i] = false;
                }

              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Error!!! Server did not respond');
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

  addNotes()
  {
    let data = {
      client_id: this.passed_client_id,
    }
    this.navCtrl.push(AddNotesPage, data);
  }

  addCaseHistory()
  {
    let data = {
      client_id: this.passed_client_id,
      isAddMode:true
    }
    this.navCtrl.push(AddCaseHistoryPage, data);
  }

  toggleShowMore(id)
  {
    if (id == 0)
    {
      //Toggle case history
      this.showCaseHistory = !this.showCaseHistory;
    }
    else
    {
      //Toggle notes
      this.showNotes = !this.showNotes;
    }
  }

  deleteCaseHistory(caseHistory: CaseHistory)
  {
    const loader = this.loadingCtrl.create({

      content: 'Deleting...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('rowId', caseHistory.id);
      

      this.http.post(this.apiValues.baseURL + "/delete_case_history.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                //Response from server
                this.showToast(data.message);
                if (data.code == 200)
                {
                  this.fetchCaseHistoryData();
                }
                return;
              }
              else
              {
                //Response is corrupted
                this.showToast('Failure!!! Error in response');

              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Error!!! Server did not respond');
      }

    });
  }

  deleteAlert(isNote: boolean,data)
  {
    const alert = this.alertCtrl.create(
      {
        message: 'Delete this record?',
        title: 'Attention!',
        buttons: [{

          text: 'Confirm',
          handler: () =>
          {
            console.log("Delete  Confirm");

            if (isNote)
            {
              this.deleteNote(data);
            }
            else
            {
              this.deleteCaseHistory(data);
            }
           
          }

        },
        {
          text: "Cancel",
          handler: () =>
          {
            console.log("Delete  Cancelled");
          }
        }
        ],

      });
    alert.present();

  }

  updateCaseHistory(caseHistory: CaseHistory)
  {
    let data = {
      client_id: this.passed_client_id,
      isAddMode: false,
      case_history: caseHistory
    }
    this.navCtrl.push(AddCaseHistoryPage, data);
  }

  reload()
  {
    this.fetchCaseHistoryData();
    this.fetchData();
  }

  deleteNote(note: ClientNote)
  {
    const loader = this.loadingCtrl.create({

      content: 'Deleting...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('rowId', note.id);


      this.http.post(this.apiValues.baseURL + "/delete_notes.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                //Response from server
                this.showToast(data.message);
                if (data.code == 200)
                {
                  this.fetchData();
                }
                return;
              }
              else
              {
                //Response is corrupted
                this.showToast('Failure!!! Error in response');

              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Error!!! Server did not respond');
      }

    });
  }
}

