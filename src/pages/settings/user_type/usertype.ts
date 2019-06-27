import {Component} from '@angular/core';
import {AlertController} from 'ionic-angular'
import {Events} from 'ionic-angular';

@Component(
{
	selector:'usertype',
	templateUrl:'usertype.html'
})

export class SettingUserTypePage
{
 	usertypes;

	constructor(public events:Events,public alertCtrl: AlertController)
	{
		this.usertypes=[

		new UserType("Guest","Active",0,"../../../assets/imgs/guest.png"),
		new UserType("Client","Active",0,"../../../assets/imgs/client.png"),
		new UserType("Case Manager","Active",0,"../../../assets/imgs/manager.png"),
		new UserType("Account","Active",0,"../../../assets/imgs/super_admin.png"),
		new UserType("Admin","Active",0,"../../../assets/imgs/admin.png")

		];
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}

	changeUserType(usertype)
	{
		console.log('Setting Selected='+usertype.setting);

		let prompt = this.alertCtrl.create({
		    title: 'Edit '+usertype.type,
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
}


class UserType
{
	type:string;
	status:string;
	setting:number;
	icon:string;

	constructor(type,status,setting,icon)
	{
		this.type=type;
		this.status=status;
		this.setting=setting;
		this.icon=icon;
	}

	setStatus(status)
	{
		this.status=status;
	}

}