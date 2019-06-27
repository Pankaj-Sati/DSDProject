import {Component} from '@angular/core';
import {NavController, NavParams } from 'ionic-angular';
import {Case} from '../../../models/case.model';

@Component({

	selector:"case_details",
	templateUrl:"case_details.html"
})
export class CaseDetailsPage
{

	public case:Case;

	constructor(public navCtrl:NavController,public navParams:NavParams)
	{


	}

	ionViewDidLoad()
	{
		this.case=this.navParams.get("caseData");
		console.log(this.case);
	}
}