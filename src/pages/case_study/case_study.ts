import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Events} from 'ionic-angular';
import {SingleCaseStudyPage} from './single_case_study/single_case_study';

@Component({
  selector: 'case_study',
  templateUrl: 'case_study.html'
})
export class CaseStudyPage
{
	c_case_type:string;
	c_client_type:string;
	c_case_category:string;
	c_case_year:string;
	c_case_manager:string;
	c_search:string;

	constructor(public events:Events,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController, public menuCtrl: MenuController) 
	{

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

}
