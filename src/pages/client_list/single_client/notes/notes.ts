import { Component } from '@angular/core';
import { Events, NavParams } from 'ionic-angular';
import { LoadingController, ToastController, NavController, NavOptions } from 'ionic-angular';
import { Http } from "@angular/http";

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';

import { AddNotesPage } from './add_notes/add_notes';

import { ClientNote } from '../../../../models/client_notes.model';


@Component({
  selector: 'notes',
  templateUrl: 'notes.html'
})

export class NotesListPage
{
  notes_list: ClientNote[] = [];
  case_history_list = [];
  noteDetail: ClientNote;
  passed_client_id;

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
      public navParams: NavParams
 
    )
  {
   
  }

  ionViewDidLoad()
  {
    console.log('Client Notes: ionViewDidLoad');
    
    this.passed_client_id = this.navParams.get('client_id');

    console.log('Client Id Received:' + this.passed_client_id);
    this.fetchData();
  }

  ionViewDidEnter()
  {
    console.log('---Ion View Did Enter---');
    if (this.navParams.data.reload)
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

  fetchCaseHistory()
  {

  }

  addNotes()
  {
    let data = {
      client_id: this.passed_client_id
    }
    this.navCtrl.push(AddNotesPage, data);
  }

  addCaseHistory()

  {

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
}

