import {Component} from '@angular/core';
import {Events} from 'ionic-angular';

@Component({
	selector: 'account_summary',
	templateUrl: 'account_summary.html'
})

export class AccountSummaryPage
{
	a_pay_mode:string;
	a_pay_status:string;
	c_pay_from:string;
	c_pay_to:string;

	constructor(public events:Events)
	{

	}
	
	searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}
}