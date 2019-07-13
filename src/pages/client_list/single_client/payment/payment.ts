import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';

import { ClientDetails } from '../../../../models/client.model';
import { User } from '../../../../models/login_user.model';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

@Component({
  selector: 'payment',
  templateUrl: 'payment.html',
})
export class ClientPaymentPage 
{
	paymentForm:FormGroup;
  

  showAddPayment:boolean=false;
  show_add_button_text: string ="Add Payment";

  clientDetails: ClientDetails;

  loggedInUser: User;

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
    public http: Http
  ) 
  {
    this.loggedInUser = this.myStorage.getParameters();

    this.paymentForm = this.formBuilder.group(
      {
        p_mode: new FormControl('', Validators.compose([Validators.required])),
        p_remark: new FormControl(''),
        p_amount: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9.]{1,10}')])),

        //Card
        p_card_holder_name: new FormControl('', Validators.compose([Validators.required])),
        p_card_no: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{10,16}')])),
        p_card_cvv: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9]{3,4}')])),
        p_card_exp: new FormControl('', Validators.compose([Validators.required])),
       
        //Bank
        p_bank_name:new FormControl('', Validators.compose([Validators.required])),
        p_bank_acc_holder_name:new FormControl('', Validators.compose([Validators.required])),
        p_bank_acc_no: new FormControl('', Validators.compose([Validators.required,  Validators.pattern('^[0-9]{9,16}')])),
        p_bank_branch_code: new FormControl('', Validators.compose([Validators.required])),
        p_bank_branch_number: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[0-9.]{1,15}')])),

      });

    this.paymentForm.controls.p_mode.setValue(2); //Default to payment by cash
  

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
      this.show_add_button_text="Add Payment"
      }
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad Payments');
    this.clientDetails = this.navParams.get('clientdetails');  
  }

  modeChanged(change)
  {
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
    }
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
    body.append('cid', this.clientDetails.id);
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
    else
    {
      body.append('pay_mode', 'Payment By Cash');
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

}
