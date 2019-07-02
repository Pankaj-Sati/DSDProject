import {Component} from '@angular/core';
import {Events} from 'ionic-angular';

@Component({
	selector: 'smslist',
	templateUrl: 'smslist.html'
})

export class SMSListPage
{
  sms_list:SMS[]=[];

  setDetailVisible: boolean = false;
  blurAmount: string = '';
  smsDetail: SMS;

	constructor(public events:Events)
	{
		this.sms_list=[
			new SMS(new Date(),"Dummy 1","SMS 1"),
			new SMS(new Date(),"Dummy 2","SMS 2"),
			new SMS(new Date(),"Dummy 3","SMS 3"),
			new SMS(new Date(),"Dummy 4","SMS 4")
		];
	}

	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
    }

  hideDetails()
  {
    this.setDetailVisible = false;
    this.blurAmount = '';
  }

  showDetails(account)
  {

    if (this.setDetailVisible == true) {
      //Already Visible

      //Set it to false so that the div hides and don't do anything
      this.hideDetails();
      return;
    }

    this.setDetailVisible = true;
    this.blurAmount = 'blurDiv';
    this.smsDetail = account;

  }

}

class SMS
{
	date:string;
	c_name:string;
	sms:string;

	constructor(date,c_name,sms)
	{
		this.date=date;
		this.c_name=c_name;
		this.sms=sms;
	}
}
