import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController, AlertController, ModalController } from 'ionic-angular';

import { Client,ClientDetails } from '../../../../models/client.model';
import { User } from '../../../../models/login_user.model';
import { Payment } from '../../../../models/client_payment.model';
import { PaymentSummary } from '../../../../models/payment_summary.model';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { AddBalanceInPaymentComponent } from '../../../../components/add-balance-in-payment/add-balance-in-payment';

@Component({
  selector: 'payment',
  templateUrl: 'payment.html',
})
export class ClientPaymentPage 
{
	paymentForm:FormGroup;

  paymentDetails: Payment; 

  showAddPayment:boolean=false;
  show_add_button_text: string ="Add Payment";

  showAddBalance: true;

  clientDetails: ClientDetails;
  passedClientID;
  loggedInUser: User;
  maxCardExpiryYear: any;

  visibility: boolean[] = [];
  payments: PaymentSummary[] = [];

  blurAmount: string = ''; //To add a blurr class when model is opened

  constructor
    (
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiValues: ApiValuesProvider,
    public myStorage: MyStorageProvider,
    public alertCtrl: AlertController,
    public http: Http,
    public modalCtrl: ModalController
  ) 
  {
    this.loggedInUser = this.myStorage.getParameters();
    this.maxCardExpiryYear = new Date(new Date().setFullYear(new Date().getFullYear() + 20)).toISOString();
    this.paymentForm = this.formBuilder.group(
      {
        p_mode: new FormControl('', Validators.compose([Validators.required])),
        p_remark: new FormControl('', Validators.compose([Validators.pattern(this.apiValues.LONG_TEXT_VALIDATOR)])),
        p_amount: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9.]{1,10}')])),

        //Card
        p_card_holder_name: new FormControl('', Validators.compose([Validators.pattern(this.apiValues.INPUT_VALIDATOR)])),
        p_card_no: new FormControl(''),
        p_card_cvv: new FormControl(''),
        p_card_exp: new FormControl(''),
       
        //Bank
        p_bank_name: new FormControl('', Validators.compose([Validators.pattern(this.apiValues.INPUT_VALIDATOR)])),
        p_bank_acc_holder_name: new FormControl('', Validators.compose([Validators.pattern(this.apiValues.INPUT_VALIDATOR)])),
        p_bank_acc_no: new FormControl(''),
        p_bank_branch_code: new FormControl(''),
        p_bank_branch_number: new FormControl(''),

      });

    this.paymentForm.controls.p_mode.setValue(2); //Default to payment by cash

   
  

  }

  fetchPaymentDetails()
  {
   
    const loader = this.loadingCtrl.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('cid', String(this.passedClientID));

      this.http.post(this.apiValues.baseURL + "/get_client_paymentDetails.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                this.showToast(data.message);
                return;
              }
              else
              {
                this.paymentDetails = data[0];
              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Timeout!!! Server did not respond');
      }

    });
  }

  toggleAddPayment()
  {
    this.showAddPayment = !this.showAddPayment;
    if (this.showAddPayment)
      {
      this.show_add_button_text="Cancel";

      }
      else
      {
      this.show_add_button_text="Record Payment"
      }
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad Payments');
    this.passedClientID = this.navParams.get('clientID');  
    this.clientDetails = this.navParams.get('clientdetails');
    this.showAddBalance = this.navParams.get('showAddBalance');
    this.fetchPaymentDetails();
    this.fetchData();
  }

  modeChanged(change)
  {

    return;
    /* -----------The following code was used to change validy on mode change. But now, these fields are non-mandatory---
    switch (change)
    {
      case 0: //Debit/Credit Card

        this.paymentForm.controls.p_card_holder_name.setValidators(Validators.compose([Validators.required]));
        this.paymentForm.controls.p_card_no.setValidators(Validators.compose([Validators.required, Validators.pattern('^[0-9]{10,16}')]));
        this.paymentForm.controls.p_card_cvv.setValidators(Validators.compose([Validators.required, Validators.pattern('^[0-9]{3,4}')]));
        this.paymentForm.controls.p_card_exp.setValidators(Validators.compose([Validators.required]));
      
        this.paymentForm.controls.p_bank_name.setValidators(null);
        this.paymentForm.controls.p_bank_acc_holder_name.setValidators(null);
        this.paymentForm.controls.p_bank_acc_no.setValidators(null);
        this.paymentForm.controls.p_bank_branch_code.setValidators(null);
        this.paymentForm.controls.p_bank_branch_number.setValidators(null);

        this.updateValidity();

        break;
      case 1: //Via Bank transfer

        this.paymentForm.controls.p_bank_name.setValidators(Validators.compose([Validators.required]));
        this.paymentForm.controls.p_bank_acc_holder_name.setValidators(Validators.compose([Validators.required]));
        this.paymentForm.controls.p_bank_acc_no.setValidators(Validators.compose([Validators.required, Validators.pattern('^[0-9]{9,16}')]));
        this.paymentForm.controls.p_bank_branch_code.setValidators(Validators.compose([Validators.required]));
        this.paymentForm.controls.p_bank_branch_number.setValidators(Validators.compose([Validators.required, Validators.pattern('^[0-9.]{1,15}')]));


        this.paymentForm.controls.p_card_holder_name.setValidators(null);
        this.paymentForm.controls.p_card_no.setValidators(null);
        this.paymentForm.controls.p_card_cvv.setValidators(null);
        this.paymentForm.controls.p_card_exp.setValidators(null);
        
        this.updateValidity();
        break;
      case 2: //Via Cash


        this.paymentForm.controls.p_bank_name.setValidators(null);
        this.paymentForm.controls.p_bank_acc_holder_name.setValidators(null);
        this.paymentForm.controls.p_bank_acc_no.setValidators(null);
        this.paymentForm.controls.p_bank_branch_code.setValidators(null);
        this.paymentForm.controls.p_bank_branch_number.setValidators(null);

        this.paymentForm.controls.p_card_holder_name.setValidators(null);
        this.paymentForm.controls.p_card_no.setValidators(null);
        this.paymentForm.controls.p_card_cvv.setValidators(null);
        this.paymentForm.controls.p_card_exp.setValidators(null);
      

        this.updateValidity();
        break;

      case 3: //Via Money Order


        this.paymentForm.controls.p_bank_name.setValidators(null);
        this.paymentForm.controls.p_bank_acc_holder_name.setValidators(null);
        this.paymentForm.controls.p_bank_acc_no.setValidators(null);
        this.paymentForm.controls.p_bank_branch_code.setValidators(null);
        this.paymentForm.controls.p_bank_branch_number.setValidators(null);

        this.paymentForm.controls.p_card_holder_name.setValidators(null);
        this.paymentForm.controls.p_card_no.setValidators(null);
        this.paymentForm.controls.p_card_cvv.setValidators(null);
        this.paymentForm.controls.p_card_exp.setValidators(null);


        this.updateValidity();
        break;

    }
    */
  }


  updateValidity()
  {
    //Card
    this.paymentForm.controls.p_card_holder_name.updateValueAndValidity();
    this.paymentForm.controls.p_card_no.updateValueAndValidity();
    this.paymentForm.controls.p_card_cvv.updateValueAndValidity();
    this.paymentForm.controls.p_card_exp.updateValueAndValidity();



    //Bank
    this.paymentForm.controls.p_bank_name.updateValueAndValidity();
    this.paymentForm.controls.p_bank_acc_holder_name.updateValueAndValidity();
    this.paymentForm.controls.p_bank_acc_no.updateValueAndValidity();
    this.paymentForm.controls.p_bank_branch_code.updateValueAndValidity();
    this.paymentForm.controls.p_bank_branch_number.updateValueAndValidity();
  }

  printLog()
  {
    console.log('Month='+this.paymentForm.value.p_card_exp);
   
  }

  submitPayment()
  {
    if (!this.paymentForm.valid)
    {
      const alert = this.alertCtrl.create({

        title: 'Attention!',
        message: 'Some Fields are empty or invalid',
        buttons:["Ok"]
      });
      alert.present();
      return;
    }

    //These lines will execute only if the form is valid

    let body = new FormData();
    body.append('cid', String(this.passedClientID));
    body.append('session_id', this.loggedInUser.id);

    body.append('payamount', this.paymentForm.value.p_amount);
    body.append('remark', this.paymentForm.value.p_remark);

    if (this.paymentForm.value.p_mode == 0)
    {
      //Debit/Credit card
      body.append('pay_mode', 'Debit/Credit Card');
      body.append('card_holder_name', this.paymentForm.value.p_card_holder_name);
      body.append('card_num', this.paymentForm.value.p_card_no);
      body.append('csc_code', this.paymentForm.value.p_card_cvv);

      let month = String(this.paymentForm.value.p_card_exp).split("-");
      console.log(month);
      body.append('cardYear', month[0]);
      body.append('cardMonth', month[1]);

    }
    else if (this.paymentForm.value.p_mode == 1)
    {
      //Bank Transfer
      body.append('pay_mode', 'Via Bank Transfer');
      body.append('bank_name', this.paymentForm.value.p_bank_name);
      body.append('account_no', this.paymentForm.value.p_bank_acc_no);
      body.append('branch_no', this.paymentForm.value.p_bank_branch_number);
      body.append('branch_code', this.paymentForm.value.p_bank_branch_code);
      body.append('acc_holder_name', this.paymentForm.value.p_bank_acc_holder_name);
    }
    else if (this.paymentForm.value.p_mode == 2)
    {
      body.append('pay_mode', 'Payment By Cash');
    }
    else
    {
      body.append('pay_mode', 'Money Order');
    }

    let loader = this.loadingCtrl.create({

      content: "Loading ...",
      duration: 15000

    });
    let loadingSuccessful = false; //To know whether the loader timeout occured or not
    loader.present().then(() => 
    {

      this.http.post(this.apiValues.baseURL + "/add_payment.php", body, null) //Http request returns an observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          console.log(serverReply);

          if (serverReply)
          {
            try
            {
              let response = JSON.parse(serverReply['_body']);

              if ('message' in response) 
              {
                this.showToast(response.message);
                this.fetchPaymentDetails();
                this.fetchData();
              }
              else
              {
                this.showToast("Failed to add payment");

              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast("Failed to add payment");
            }
            
          }
          else
          {
            this.showToast("Failed to add payment");
          }
          
          loader.dismiss();
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to load data');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Timeout!!!Server Did Not Respond');
      }
    });


  }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration:3000
    });

    toast.present();
  }

  addBalance()
  {
    console.log('Add Balance');
    let data =
    {
      clientID: this.passedClientID,
      clientDetails: this.clientDetails
    }
    const modal = this.modalCtrl.create(AddBalanceInPaymentComponent, data);
    this.blurAmount = 'blurDiv';
    modal.present();

    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
      this.fetchPaymentDetails();
      this.fetchData(); 
    });
  }

  fetchData()
  {
    this.payments = [];

    const loader = this.loadingCtrl.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('cid', this.passedClientID);

      this.http.post(this.apiValues.baseURL + "/user_ACmngt_pymntSmry.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                this.showToast(data.message);
                return;
              }
              else
              {
                this.payments = data;
                for (let i = 0; i < this.payments.length; i++)
                {
                  this.visibility[i] = false;
                }
              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Timeout!!! Server did not respond');
      }

    });

  }

  showDetails(payment, showEvent, i)
  {
    this.visibility[i] = !this.visibility[i];
  }

}
