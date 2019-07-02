import {Component} from '@angular/core';
import {AlertController} from 'ionic-angular'
import {Events} from 'ionic-angular';

@Component(
{
	selector:'casetype',
	templateUrl:'casetype.html'
})

export class SettingCaseTypePage
{
 	casetypes;

	constructor(public events:Events,public alertCtrl: AlertController)
	{
		this.casetypes=[

		new CaseType("Divorce","Dummy 1",new Date(),"Active","assets/imgs/divorce.png"),
		new CaseType("Criminal","Dummy 2",new Date(),"Active","assets/imgs/criminal.png"),
		new CaseType("Murder","Dummy 3",new Date(),"Active","assets/imgs/murder.png"),
		new CaseType("Civil","Dummy 4",new Date(),"Active","assets/imgs/civil.png")

		];
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


class CaseType
{
	type:string;
	created_by:string;
	created_on:string;
	status:string;
	icon:string;

	constructor(type,created_by,created_on,status,icon)
	{
		this.type=type;
		this.created_by=created_by;
		this.created_on=created_on;
		this.status=status;
		this.icon=icon;
	}

	setStatus(status)
	{
		this.status=status;
	}

}