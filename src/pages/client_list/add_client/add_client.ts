import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import "rxjs/add/operator/map";

import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { ClientEntityRelationshipProvider } from '../../../providers/client-entity-relationship/client-entity-relationship';

@Component({
  selector: 'add_client',
  templateUrl: 'add_client_new.html'
})



export class AddClientPage
{

	advocate_list:any;

  addClientForm: FormGroup;
  addEntityForm: FormGroup[]=[];

  showCaseDetails: boolean = true;
  showPersonalDetails: boolean = false;
  showParmanentAddressDetails: boolean = false;
  showCaseManagerDetails: boolean = false;
  showDefendantDetails: boolean = false;
  showEntityDetails: boolean = false;

  isBillingAndPermanentAddressSame: boolean = false;
  totalEntities: number = 0;

  relationshipList: any;

  hasRelation:boolean=false;


  constructor(public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private http: Http,
    public loading: LoadingController,
    public relationshipProvider: ClientEntityRelationshipProvider
  )
	{
      this.addClientForm = this.formBuilder.group({

        //Case details
			c_case_type:new FormControl('',Validators.compose([Validators.required])),
			c_alien_no:new FormControl('',Validators.compose([Validators.required])),
			c_case_category:new FormControl('',Validators.compose([Validators.required])),
			c_case_description:new FormControl(''),
          c_date: new FormControl('', Validators.compose([Validators.required])),

          //personal Details
			c_name:new FormControl('',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z\-\']+')])),
			c_alias:new FormControl('',Validators.compose([Validators.pattern('^[a-zA-Z\-\']+')])),
          c_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
          c_alt_no: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
          c_email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
          c_notes: new FormControl('', Validators.compose([Validators.required])),
			c_country:new FormControl('',Validators.compose([Validators.required])),
			c_street:new FormControl('',Validators.compose([Validators.required])),
			c_city:new FormControl('',Validators.compose([Validators.required])),
			c_state:new FormControl('',Validators.compose([Validators.required])),
          c_zipcode: new FormControl('', Validators.compose([Validators.required])),
          c_country_billing: new FormControl('', Validators.compose([Validators.required])),
          c_street_billing: new FormControl('', Validators.compose([Validators.required])),
          c_city_billing: new FormControl('', Validators.compose([Validators.required])),
          c_state_billing: new FormControl('', Validators.compose([Validators.required])),
        c_zipcode_billing: new FormControl('', Validators.compose([Validators.required])),

          //Case Manager Details
			c_filing_cm:new FormControl(''),
        c_cm_assigned: new FormControl('', Validators.compose([Validators.required])),

        //Defendant Details
        c_defendent_name: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z\-\']+')])),
			c_defendent_alias:new FormControl('',Validators.compose([Validators.pattern('^[a-zA-Z\-\']*')])),
        c_defendent_manager: new FormControl(''),

			c_reg_fee:new FormControl('',Validators.compose([Validators.required])),
			c_decided_fee:new FormControl('',Validators.compose([Validators.required]))

		});

    this.getCaseManagerList();
    this.relationshipList=this.relationshipProvider.getAllRelationships();

	}


	isValid(email) 
    {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
	}

	isValidName(name)
	{
		var re=/^[A-Za-z]+$/;
		return re.test(String(name));
	}
	makeAlertDialog(message)
	{
		let alert = this.alertCtrl.create({

			 title:"ATTENTION",

			subTitle:message,

			buttons: ["OK"]

			});

			alert.present();

	}
	
	submitData()
	{

		if(! this.addClientForm.valid)
		{
			//Form is invalid

			this.makeAlertDialog('Invalid inputs! Please correct your values');
			return;
		}

		//Following lines will execute only if the form fields are correct
		
		var headers = new Headers();

	       headers.append("Accept", "application/json");

	       headers.append("Content-Type", "application/json" );

	       let options = new RequestOptions({ headers: headers });

	  
	       /*
	       let data = { //Data to be sent to the server

	            case_type:this.c_case_type,
			    case_no:this.c_alien_no,
			    case_category:this.c_case_category,
			    adv_assign:this.c_cm_assigned,
			    op_full_name:,
			    full_name:[Aakash Chaudhary],
			    p_streetNoName:[GulmoharStreet No-2],
			    p_city:[jkljkljljkj],
			    p_state:[kjkkljkjlj],
			    p_pin_code:[78656],
			    p_country:[United States],
			    client_group:ENTITY,
			    filing_adv_name:,
			    client_type:Test1,
			    case_desc:dummy text,
			    op_alias:[],
			    op_adv_name:,
			    registration_fee:20000,
			    decided_fee:10000,
			    alias:[],
			    contact:[9599104387],
			    alternate_number:[9599104387],
			    email:[aakashchaudhary@gamil.com],
			    notes:[dummy text],
			    b_state:[jkljkljljkj],
			    b_city:[kjkkljkjlj],
			    b_pin_code:[78656],
			    b_streetNoName:[Gali no-3, Sector-43],
			    relationship:[]
	         };
	         */

	         let data={

	         };
			let loader = this.loading.create({

			   content: "Adding client please wait…",

			 });

		   loader.present().then(() => 
			{

		   this.http.post(this.apiValue.baseURL+"/add_client",data,options) //Http request returns an observable

		   .map(response => response.json()) ////To make it easy to read from observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
					  
				{ 
			   			console.log(serverReply);
			   			loader.dismiss();
				      

				   });

	  		 });
	}

	getCaseManagerList()
	{
		this.advocate_list=[];

		var headers = new Headers();

	       headers.append("Accept", "application/json");

	       headers.append("Content-Type", "application/json" );

	       let options = new RequestOptions({ headers: headers });

	       let data=
	       {

	         };
			let loader = this.loading.create({

			   content: "Getting info. please wait…",

			 });

		   loader.present().then(() => 
			{

		   this.http.post(this.apiValue.baseURL+"/get_advocate.php",data,options) //Http request returns an observable

		   .map(response => response.json()) ////To make it easy to read from observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
					  
				{ 
			   			console.log(serverReply);
			   			this.advocate_list=serverReply;
			   			loader.dismiss();

			   		
				      
				   });

	  		 });
    }

  toggleShowMore(id)
  {
    switch (id) {
      case 0: this.showCaseDetails = !this.showCaseDetails;
        break;
      case 1: this.showPersonalDetails = !this.showPersonalDetails;
        break;
      case 2: this.showParmanentAddressDetails = !this.showParmanentAddressDetails;
        break;
      case 3: this.showCaseManagerDetails = !this.showCaseManagerDetails;
        break;
      case 4: this.showDefendantDetails = !this.showDefendantDetails;
        break;
      case 5: this.showEntityDetails = !this.showEntityDetails;
        break;
    }
  }

  setBillingAddressSame()
  {
    this.isBillingAndPermanentAddressSame = ! this.isBillingAndPermanentAddressSame;

    if (this.isBillingAndPermanentAddressSame)
    {
     this.copyAddresses();
    }
  }

  copyAddresses()
  {
    this.addClientForm.controls.c_country_billing.setValue(this.addClientForm.value.c_country);
    this.addClientForm.controls.c_country_billing.updateValueAndValidity();

    this.addClientForm.controls.c_street_billing.setValue(this.addClientForm.value.c_street);
    this.addClientForm.controls.c_street_billing.updateValueAndValidity();

    this.addClientForm.controls.c_city_billing.setValue(this.addClientForm.value.c_city);
    this.addClientForm.controls.c_city_billing.updateValueAndValidity();

    this.addClientForm.controls.c_state_billing.setValue(this.addClientForm.value.c_state);
    this.addClientForm.controls.c_state_billing.updateValueAndValidity();

    this.addClientForm.controls.c_zipcode_billing.setValue(this.addClientForm.value.c_zipcode);
    this.addClientForm.controls.c_zipcode_billing.updateValueAndValidity();
  }

  addEntities()
  {

    let newEntity = new FormBuilder().group({

      e_relationship:new FormControl('', Validators.required),

      //personal Details
      e_name: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z\-\']+')])),
      e_alias: new FormControl('', Validators.compose([Validators.pattern('^[a-zA-Z\-\']+')])),
      e_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      e_alt_no: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      e_email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      e_notes: new FormControl('', Validators.compose([Validators.required])),
      e_country: new FormControl('', Validators.compose([Validators.required])),
      e_street: new FormControl('', Validators.compose([Validators.required])),
      e_city: new FormControl('', Validators.compose([Validators.required])),
      e_state: new FormControl('', Validators.compose([Validators.required])),
      e_zipcode: new FormControl('', Validators.compose([Validators.required])),
      e_country_billing: new FormControl('', Validators.compose([Validators.required])),
      e_street_billing: new FormControl('', Validators.compose([Validators.required])),
      e_city_billing: new FormControl('', Validators.compose([Validators.required])),
      e_state_billing: new FormControl('', Validators.compose([Validators.required])),
      e_zipcode_billing: new FormControl('', Validators.compose([Validators.required])),

    });

    this.addEntityForm[this.totalEntities] = newEntity;
    //Lastly We will increase entities
    this.totalEntities++;
  }

  removeEntities(index)
  {
    this.addEntityForm.splice(index, 1); //Remove 1 item at the index from the array
  }
}
