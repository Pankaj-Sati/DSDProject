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
  noteDetail: ClientNote;
  passed_client_id;
  n_search: string = '';//Search string
  visibility: boolean[] = [];


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


  showDetails(smsSelected, showEvent, i)
  {
    /*
    let option: PopoverOptions = {
 
    };
    const popover = this.popoverCtrl.create(SmsDetailComponent, { sms: smsSelected }, option);

    popover.present({
      ev: showEvent
    });
    */

    /*
    let options: ModalOptions = {
     
    };
    const modal = this.modalCtrl.create(SmsDetailComponent, { sms: smsSelected });
    modal.present();
    */

    this.visibility[i] = !this.visibility[i];


  }

  fetchData()
  {

    this.notes_list = [];
    this.visibility = [];

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
                  this.visibility[i] = false;
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
      client_id: this.passed_client_id
    }
    this.navCtrl.push(AddNotesPage, data);
  }
}

