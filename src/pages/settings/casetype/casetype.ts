import { Component } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular'
import { Events } from 'ionic-angular';

import { CaseType } from '../../../models/case_type.model';

import { CaseTypeProvider } from '../../../providers/case-type/case-type';

@Component(
{
	selector:'casetype',
	templateUrl:'casetype.html'
})

export class SettingCaseTypePage
{
  casetypes: CaseTypeModified[]=[];

  constructor(public events: Events,
    public alertCtrl: AlertController,
    public caseTypeProvider: CaseTypeProvider,
    public toastCtrl: ToastController
  )
  {

    if (this.caseTypeProvider.isEmpty)
    {
      this.showToast('Failure!!! Cannot get case types');
    }

    //Currently the Case type API does not return created by and image. So we will use static content
    this.casetypes = [

      new CaseTypeModified("Divorce", "Dummy 1", new Date(), "Active", "assets/imgs/divorce.png"),
      new CaseTypeModified("Criminal", "Dummy 2", new Date(), "Active", "assets/imgs/criminal.png"),
      new CaseTypeModified("Murder", "Dummy 3", new Date(), "Active", "assets/imgs/murder.png"),
      new CaseTypeModified("Civil", "Dummy 4", new Date(), "Active", "assets/imgs/civil.png")

    ];

    //this.casetypes = this.caseTypeProvider.caseTypeList;

		
  }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration:3000
    });
    toast.present();
  }
	changeCaseType(casetype)
	{

		let prompt = this.alertCtrl.create({
		    title: 'Edit '+casetype.type,
		    message: 'Select option ',
		    inputs : [
		    {
		        type:'radio',
		        label:'Edit',
		        value:'1'
		    },
		    {
		        type:'radio',
		        label:'Status',
		        value:'2'
		    },
		    {
		    	type:'radio',
		    	label:'Delete',
		    	value: '3'
		    }
		    ],
		    buttons : [
		    {
		        text: "Cancel",
		        handler: data => {
		        console.log("cancel clicked");
		        }
		    },
		    {
		        text: "Ok",
		        handler: data => 
		        {
		        	console.log("Ok clicked"+ data);

		        	switch(data)
		        	{
		        		case "1":
		        		break;

		        		case "2":
		        		break;

		        		case "3":
		        		break;
		        	}
		        }
		    }]});
		    prompt.present();
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}
}

class CaseTypeModified
{
  type: string;
  created_by: string;
  created_on: string;
  status: string;
  icon: string;

  constructor(type, created_by, created_on, status, icon)
  {
    this.type = type;
    this.created_by = created_by;
    this.created_on = created_on;
    this.status = status;
    this.icon = icon;
  }

  setStatus(status)
  {
    this.status = status;
  }
}
