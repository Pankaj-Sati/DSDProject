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

  setDetailVisible: boolean = false;
  blurAmount: string = '';
 
  accounts: AccountSummary[] = [];
  detailAccount: AccountSummary;


	constructor(public events:Events)
	{
      this.accounts = [

        new AccountSummary("Client 1", "154", new Date() + "", "Payment By Cash", 4000, 3000),
        new AccountSummary("Client 2", "15423", new Date()+"", "Cash", 4000, 3000),
        new AccountSummary("Client 3", "1we54", new Date() + "", "REGISTRATION CHARGES", 4000, 3000),
        new AccountSummary("Client 4", "121354", new Date()+"", "Cash", 4000, 3000),
        
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
    this.detailAccount = account;

  }
}

class AccountSummary
{
  client_name: string;
  alien_no: string;
  date: string;
  payment_mode: string;
  payment_overdue: number;
  amount: number;

  constructor(name: string,
    alien_no: string,
    date: string,
    payment_mode: string,
    payment_overdue: number,
    amount: number) {

    this.client_name = name;
    this.alien_no = alien_no;
    this.date = date;
    this.payment_mode = payment_mode;
    this.payment_overdue = payment_overdue;
    this.amount = amount;

  }
}
