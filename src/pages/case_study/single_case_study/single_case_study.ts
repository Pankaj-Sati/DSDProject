import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'single_case_study',
  templateUrl: 'single_case_study.html'
})

export class SingleCaseStudyPage
{
	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController, public menuCtrl: MenuController) 
	{

	}

}