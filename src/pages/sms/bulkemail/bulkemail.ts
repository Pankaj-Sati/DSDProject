import {Component} from '@angular/core';
import {Events} from 'ionic-angular';

@Component({
	selector: 'bulkemail',
	templateUrl: 'bulkemail.html'
})

export class SMSBulkEmailPage
{
	emails;

	constructor(public events:Events)
	{
		this.emails=[
			new Email(new Date(),"1","Dummy 1","SMS 1"),
			new Email(new Date(),"2","Dummy 2","SMS 2"),
			new Email(new Date(),"3","Dummy 3","SMS 3"),
			new Email(new Date(),"4","Dummy 4","SMS 4")
		];
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}
}

class Email
{
	date:string;
	alien_no:string;
	c_name:string;
	sms:string;

	constructor(date,alien_no,c_name,sms)
	{
		this.date=date;
		this.alien_no=alien_no;
		this.c_name=c_name;
		this.sms=sms;
	}
}
