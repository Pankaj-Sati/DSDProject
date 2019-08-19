import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import { MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { CaseStudy } from '../../models/case_study.model';
import { CaseType } from '../../models/case_type.model';
import { User } from '../../models/login_user.model';

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';
import { CaseTypeProvider } from '../../providers/case-type/case-type';
import {SingleCaseStudyPage} from './single_case_study/single_case_study';
import { AdvocateListProvider } from '../../providers/advocate-list/advocate-list';

@Component({
  selector: 'case_study',
  templateUrl: 'case_study.html'
})
export class CaseStudyPage
{
	c_case_type:string='';
	c_client_type:string='';
	c_case_category:string='';
	c_case_year:string='';
	c_case_manager:string='';
  c_search: string='';

  caseList: CaseStudy[] = [];

  loggedInUser: User;

  caseTypeList: CaseType[]=[];

  caseManagerList: any;

  constructor(public events: Events,
    public caseTypeProvider: CaseTypeProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public advocateListProvider: AdvocateListProvider,
    public apiValue: ApiValuesProvider,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public myStorage: MyStorageProvider,
    public menuCtrl: MenuController) 
  {
    this.loggedInUser = this.myStorage.getParameters();
    this.getManagers();
    if (this.caseTypeProvider.isEmpty)
    {
      this.showToast('Failure!!! Cannot get Case types');
    }

    this.caseTypeList = this.caseTypeProvider.caseTypeList;

    this.fetchData();
	}

  getManagers()
  {
    this.advocateListProvider.getAdvocateList().map(response => response.json())
      .subscribe(serverReply =>
      {

        console.log(serverReply);

        if (serverReply == null || serverReply.length == 0)
        {
          this.showToast("Failure in getting Manager List");
        }
        else
        {
          this.caseManagerList = serverReply;
        }
      })

  }

	openClient()
	{
		let data={

		};
		this.navCtrl.push(SingleCaseStudyPage,data);
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });

    toast.present();
  }

  fetchData()
  {
    this.caseList = [];

    const loader = this.loading.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {
      /*
       *http://myamenbizzapp.com/dsd/api_work/case_study_list.php?case_type=1
       * &case_category=77&advocate=8&search=Prakash Gupta&year=2019&client_type
       * */
      let body = new FormData();

      body.append('case_type', this.c_case_type);
      body.append('client_type', this.c_client_type);
      body.append('case_category', this.c_case_category);
      body.append('year', this.c_case_year);
      body.append('advocate', this.c_case_manager);
      body.append('search', this.c_search);
      body.append('user_type_id', this.loggedInUser.user_type_id);

      this.http.post(this.apiValue.baseURL + "/case_study_list.php", body, null)
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
                this.caseList = data;

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

  openCase(singleCase)
  {
   
      let data =
      {
        caseDetails: singleCase
      };
    this.navCtrl.push(SingleCaseStudyPage, data);

  }
}
