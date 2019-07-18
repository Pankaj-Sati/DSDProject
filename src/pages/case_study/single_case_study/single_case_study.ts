import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import {DownloadDocumentsComponent } from '../../../components/download-documents/download-documents';
import { CaseStudy } from '../../../models/case_study.model';
import { ApiValuesProvider } from '../../../providers/api-values/api-values';

@Component({
  selector: 'single_case_study',
  templateUrl: 'single_case_study.html'
})

export class SingleCaseStudyPage
{

  caseDetails: CaseStudy;

  hearingList:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public apiValue: ApiValuesProvider,
    public menuCtrl: MenuController) 
  {
    this.fetchData();
	}

  ionViewDidLoad()
  {
    this.caseDetails = this.navParams.get('caseDetails');

    console.log(this.caseDetails);
  }

  fetchData()
  {
   
    this.hearingList = [];
    const loader = this.loading.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {
      /*
       * http://myamenbizzapp.com/dsd/api_work/case_study_list_tabs.php?cid=52
       * &case_category=77&advocate=8&search=Prakash Gupta&year=2019&client_type
       * */
      let body = new FormData();

      body.append('cid', this.caseDetails.id);

      this.http.post(this.apiValue.baseURL + "/case_study_list_tabs.php", body, null)
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
                this.hearingList = data;

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

  downloadDocs(docsName)
  {
    if (docsName == null || docsName.length == 0)
    {
      return;
    }

    let data =
    {
      document: docsName
    };

    const modal=this.modalCtrl.create(DownloadDocumentsComponent, data);

    modal.present();
  }

}
