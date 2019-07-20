import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import "rxjs/add/operator/map";

import { User } from '../../../models/login_user.model';
import { CaseType } from '../../../models/case_type.model';

import { MyStorageProvider } from '../../../providers/my-storage/my-storage';
import { CaseTypeProvider } from '../../../providers/case-type/case-type';
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
  addEntityForm: FormArray;

  loggedInUser: User;

  caseTypeList: CaseType[] = [];

  showCaseDetails: boolean = true;
  showPersonalDetails: boolean = false;
  showParmanentAddressDetails: boolean = false;
  showCaseManagerDetails: boolean = false;
  showDefendantDetails: boolean = false;
  showEntityDetails: boolean = false;
  showEachEntityDetails: boolean[] =[];

  isBillingAndPermanentAddressSame: boolean = false;
  isBillingAndPermanentAddressSameForEntity: boolean[]=[];
  totalEntities: number = 0;
  

  relationshipList: any;

  hasRelation:boolean=false;


  constructor(
    public myStorage: MyStorageProvider,
    public apiValue: ApiValuesProvider,
    public caseTypeProvider: CaseTypeProvider,
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
			c_client_type:new FormControl('',Validators.compose([Validators.required])),
			c_case_category:new FormControl('',Validators.compose([Validators.required])),
			c_case_description:new FormControl(''),
          c_date: new FormControl('', Validators.compose([Validators.required])),

          //personal Details
			c_name:new FormControl('',Validators.compose([Validators.required])),
			c_alias:new FormControl(''),
          c_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
          c_alt_no: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
        c_email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
          c_notes: new FormControl(''),
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

        //Entities
        entity: this.formBuilder.array([]),

          //Case Manager Details
			c_filing_cm:new FormControl(''),
        c_cm_assigned: new FormControl('', Validators.compose([Validators.required])),

        //Defendant Details
        c_defendent_name: new FormControl(''),
			c_defendent_alias:new FormControl(''),
        c_defendent_manager: new FormControl(''),

       // c_reg_fee: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])),
       // c_decided_fee: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]))

		});

    if (this.caseTypeProvider.isEmpty)
    {
      this.showToast('Failure!!! Cannot get case types');
    }
    this.caseTypeList = this.caseTypeProvider.caseTypeList;

    this.getCaseManagerList();
    this.relationshipList = this.relationshipProvider.getAllRelationships();
    this.loggedInUser = this.myStorage.getParameters();
	}


	isValid(email) 
    {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
    }

  changeRelation(val: boolean)
  {
    this.hasRelation = val;
    if (!this.hasRelation) {
      //If the user has changed the case type from relation to individual, we need to remove validators on entities.
      if (this.totalEntities>0)
      {
        let loader = this.loading.create({

          content: 'Please Wait...',
          duration:10000
        });

        let loadingSuccessful = false; //To know whether loading timeout occured 

        loader.present().then(() =>
        {
            for (let i = 0; i < this.totalEntities; i++)
            {
              this.setEntityValidatorsNull(i, 'e_relationship');
              this.setEntityValidatorsNull(i, 'e_name');
              this.setEntityValidatorsNull(i, 'e_alias');
              this.setEntityValidatorsNull(i, 'e_contact');
              this.setEntityValidatorsNull(i, 'e_alt_no');
              this.setEntityValidatorsNull(i, 'e_email');
              this.setEntityValidatorsNull(i, 'e_notes');
              this.setEntityValidatorsNull(i, 'e_country');
              this.setEntityValidatorsNull(i, 'e_street');
              this.setEntityValidatorsNull(i, 'e_city');
              this.setEntityValidatorsNull(i, 'e_state');
              this.setEntityValidatorsNull(i, 'e_zipcode');
              this.setEntityValidatorsNull(i, 'e_country_billing');
              this.setEntityValidatorsNull(i, 'e_street_billing');
              this.setEntityValidatorsNull(i, 'e_city_billing');
              this.setEntityValidatorsNull(i, 'e_state_billing');
              this.setEntityValidatorsNull(i, 'e_zipcode_billing');
            }
          loadingSuccessful = true;
          loader.dismiss();
        });

        loader.onDidDismiss(() => {

          if (! loadingSuccessful)
          {
            this.showToast('Internal Error!!!');
          }

        });
      }
      
    }

    else
    {
      if (this.totalEntities>0)
      {
        this.addEntityValidators();
      }
      
    }
  }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration:3000
    });
    toast.present();
  }

  setEntityValidatorsNull(i,_fControl)
  {
    this.addClientForm.get('entity')['controls'][i].get(_fControl).setValidators(null);
    this.addClientForm.get('entity')['controls'][i].get(_fControl).updateValueAndValidity();

  }

  addEntityValidators()
  {

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

       message: message,

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

      if (this.hasRelation && this.totalEntities <= 0)
      {
        //User has selected Case registration as relation but has not added any entity

        this.makeAlertDialog('No Entities Added!!! Add some entities or mark registration as Individual');
        return;
      }

      console.log("-----Entity Data---");
      console.log(this.addClientForm.value.entity);
      console.log(JSON.stringify(this.addClientForm.value.entity));
	    /*
	       
      let body = new FormData();  //Data to be sent to the server
     
                        http://myamenbizzapp.com/dsd/api_work/add_client.php?
                        case_type=5&case_no=115&case_category=New
                        &adv_assign=13&op_full_name=SunakshiSingh
                        &full_name=Papu&p_streetNoName=GulmoharStreetNo-2
                        &p_city=delhi&p_state=delhi&p_pin_code=686867897
                        &p_country=UnitedStates&client_group=ENTITY
                        &filing_adv_name=raj kumar&client_type=Test1
                        &case_desc=dummytext&op_alias=Rahul Singh
                        &op_adv_name=kukkke&registration_fee=20000
                        &decided_fee=10000&alias=raja&contact=9599104345
                        &alternate_number=9599104387&email=aakashchaudharyq@gamil.com
                        &notes=dummytext&b_state=jkljkljljkj&b_city=kjkkljkjlj
                        &b_pin_code=kjkkljkjlj&b_streetNoName=FSDFSDD
                        &session_id=1&relationship[]=[{"e_name":"Entity1","e_alias":"","e_contact":"89723","e_alt_no":"238","e_email":"entity1@gmails.com","e_notes":"dsd","e_country":"UnitedStates","e_street":"Street1","e_city":"NY","e_state":"State1","e_zipcode":"78234","e_country_billing":"UnitedStates","e_street_billing":"jsdh","e_city_billing":"sds","e_state_billing":"fdsgjfd","e_zipcode_billing":"23213","e_relationship":"Father"},{"e_name":"Entity2","e_alias":"","e_contact":"89546723","e_alt_no":"64238","e_email":"entity2@gmails.com","e_notes":"dsd","e_country":"UnitedStates","e_street":"Street2","e_city":"NY","e_state":"State2","e_zipcode":"78234","e_country_billing":"UnitedStates","e_street_billing":"jsdh","e_city_billing":"sds","e_state_billing":"fdsgjfd","e_zipcode_billing":"23213","e_relationship":"Father"}]
                          &case_reg_date=13-07-2019    
     
          body.set('case_type', this.addClientForm.value.c_case_type);
          body.set('case_no', this.addClientForm.value.c_alien_no);
          body.set('case_category', this.addClientForm.value.c_case_category);
          body.set('adv_assign', this.addClientForm.value.c_cm_assigned);
          body.set('op_full_name', this.addClientForm.value.c_defendent_name);
          body.set('full_name', this.addClientForm.value.c_name);
          body.set('p_streetNoName', this.addClientForm.value.c_street);
          body.set('p_city', this.addClientForm.value.c_city);
          body.set('p_state', this.addClientForm.value.c_state);
          body.set('p_pin_code', this.addClientForm.value.c_zipcode);
          body.set('p_country', this.addClientForm.value.c_country);
          body.set('filing_adv_name', this.addClientForm.value.c_filing_cm);
          body.set('client_type', this.addClientForm.value.c_client_type);
          body.set('case_desc', this.addClientForm.value.c_case_description);
          body.set('op_alias', this.addClientForm.value.c_defendent_alias);
          body.set('op_adv_name', this.addClientForm.value.c_defendent_manager);
            //body.append('registration_fee', this.addClientForm.value.c_reg_fee);
            //body.append('decided_fee', this.addClientForm.value.c_decided_fee);
          body.set('alias', this.addClientForm.value.c_alias);
          body.set('contact', String(this.addClientForm.value.c_contact).replace(/\D+/g, ''));
          body.set('alternate_number', String(this.addClientForm.value.c_alt_no).replace(/\D+/g,''));
          body.set('email', this.addClientForm.value.c_email);
          body.set('notes', this.addClientForm.value.c_notes);
          body.set('b_state', this.addClientForm.value.c_state_billing);
          body.set('b_city', this.addClientForm.value.c_city_billing);
          body.set('b_pin_code', this.addClientForm.value.c_zipcode_billing);
          body.set('b_streetNoName', this.addClientForm.value.c_street_billing);
          body.set('case_reg_date', this.addClientForm.value.c_date);
          body.set('session_id', this.loggedInUser.id);

          if (this.totalEntities > 0)
          {
            for (let i = 0; i < this.totalEntities; i++)
            {
              this.addClientForm.get('entity')['controls'][i].controls.e_contact.setValue(String(this.addClientForm.get('entity')['controls'][i].value.e_contact).replace(/\D+/g,''));
              this.addClientForm.get('entity')['controls'][i].controls.e_alt_no.setValue(String(this.addClientForm.get('entity')['controls'][i].value.e_alt_no).replace(/\D+/g,''));

            }
            body.set('relationship[]', JSON.stringify(this.addClientForm.value.entity));
            body.set('client_group', 'ENTITY');
          }
          else
          {
            body.set('relationship[]','');
            body.set('client_group','INDIVIDUAL');
          }

      */

      console.log(this.addClientForm);
			         
			let loader = this.loading.create({

              content: "Adding client please wait…",
              duration:15000

			 });

      let loadingSuccessful = false;//To know whether timeout occured or not

		   loader.present().then(() => 
			{

       this.http.get(this.makeSubmitURL()) //Http request returns an observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
					  
           {
             loadingSuccessful = true;
             loader.dismiss();
             console.log(serverReply);

             if (serverReply)
             {
               try
               {
                 let response = JSON.parse(serverReply['_body']);
                 if ('code' in response)
                 {
                   this.showToast(response.message);
                   if (response.code == 200)
                   {
                     //Added successfully
                     this.navCtrl.getPrevious().data.reload = true;
                     this.navCtrl.pop();
                   }
                 }
                 else
                 {
                   this.showToast("Failed to add client");
                 }
               }
               catch (err)
               {
                 this.showToast("Failed to add client");
               }
              
               
             }
             else
             {
               this.showToast("Failed to add client");
             }
            


           }, error =>
             {
               loadingSuccessful = true;
               loader.dismiss();
               this.showToast("Failed to add client");
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

  toggleShowMoreEntity(index)
  {
    this.showEachEntityDetails[index] = !this.showEachEntityDetails[index];
  }

  setBillingAddressSame()
  {
    this.isBillingAndPermanentAddressSame = ! this.isBillingAndPermanentAddressSame;

    if (this.isBillingAndPermanentAddressSame)
    {
     this.copyAddresses();
    }
  }

  setBillingAddressSameForEntity(index)
  {
    this.isBillingAndPermanentAddressSameForEntity[index] = !this.isBillingAndPermanentAddressSameForEntity[index];
    if (this.isBillingAndPermanentAddressSameForEntity[index])
    {
      this.copyEntityAddresses(index);
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

  copyEntityAddresses(i)
  {
    console.log("Index" + i);
    this.addClientForm.get('entity')['controls'][i].controls.e_country_billing.setValue(this.addClientForm.get('entity')['controls'][i].value.e_country);
    this.addClientForm.get('entity')['controls'][i].controls.e_country_billing.updateValueAndValidity();

    this.addClientForm.get('entity')['controls'][i].controls.e_street_billing.setValue(this.addClientForm.get('entity')['controls'][i].value.e_street);
    this.addClientForm.get('entity')['controls'][i].controls.e_street_billing.updateValueAndValidity();

    this.addClientForm.get('entity')['controls'][i].controls.e_city_billing.setValue(this.addClientForm.get('entity')['controls'][i].value.e_city);
    this.addClientForm.get('entity')['controls'][i].controls.e_city_billing.updateValueAndValidity();

    this.addClientForm.get('entity')['controls'][i].controls.e_state_billing.setValue(this.addClientForm.get('entity')['controls'][i].value.e_state);
    this.addClientForm.get('entity')['controls'][i].controls.e_state_billing.updateValueAndValidity();

    this.addClientForm.get('entity')['controls'][i].controls.e_zipcode_billing.setValue(this.addClientForm.get('entity')['controls'][i].value.e_zipcode);
    this.addClientForm.get('entity')['controls'][i].controls.e_zipcode_billing.updateValueAndValidity();
  }

  initializeEntityForm(): FormGroup
  {
    let newEntity: FormGroup = new FormBuilder().group({

      e_relationship: new FormControl('', Validators.required),

      //personal Details
      e_name: new FormControl('', Validators.compose([Validators.required])),
      e_alias: new FormControl(''),
      e_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      e_alt_no: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      e_email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
      e_notes: new FormControl(''),
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
    return newEntity
  }

  addEntities()
  {

    let newEntity: FormGroup = this.initializeEntityForm();


    this.addEntityForm = this.addClientForm.get('entity') as FormArray;
    this.addEntityForm.push(newEntity);
    this.showEntityDetails = true;
    //Lastly We will increase entities
    this.isBillingAndPermanentAddressSameForEntity.push(false);
    this.showEachEntityDetails.push(false);
    this.totalEntities++;
  }

  removeEntity(index)
  {
    this.addEntityForm = this.addClientForm.get('entity') as FormArray;

    this.isBillingAndPermanentAddressSameForEntity.splice(index, 1);//Remove from the same address array
    this.showEachEntityDetails.splice(index, 1);//Remove from the visibility array
    this.addEntityForm.removeAt(index); //Remove 1 item at the index from the array
    this.totalEntities--;
  }

  makeSubmitURL(): string
  {
    let url = this.apiValue.baseURL + '/add_client.php?';

    url = url + 'case_type=' + this.addClientForm.value.c_case_type;

    url = url + '&case_no=' + this.addClientForm.value.c_alien_no;
    url = url + '&case_category=' + this.addClientForm.value.c_case_category;

    url = url + '&' + 'adv_assign=' + this.addClientForm.value.c_cm_assigned;
    url = url + '&' + 'op_full_name=' + this.addClientForm.value.c_defendent_name;
    url = url + '&' + 'full_name=' + this.addClientForm.value.c_name;

    url = url + '&' + 'p_streetNoName=' + this.addClientForm.value.c_street;
    url = url + '&' + 'p_city=' + this.addClientForm.value.c_city;
    url = url + '&' + 'p_state=' + this.addClientForm.value.c_state;
    url = url + '&' + 'p_pin_code=' + this.addClientForm.value.c_zipcode;
    url = url + '&' + 'p_country=' + this.addClientForm.value.c_country;
    url = url + '&' + 'filing_adv_name=' + this.addClientForm.value.c_filing_cm;
    url = url + '&' + 'client_type=' + this.addClientForm.value.c_client_type;
    url = url + '&' + 'case_desc=' + this.addClientForm.value.c_case_description;
    url = url + '&' + 'op_alias=' + this.addClientForm.value.c_defendent_alias;
    url = url + '&' + 'op_adv_name=' + this.addClientForm.value.c_defendent_manager;
    //url = url + '&' + 'registration_fee='+ this.addClientForm.value.c_reg_fee;
    //url = url + '&' + 'decided_fee='+ this.addClientForm.value.c_decided_fee;

    url = url + '&' + 'alias=' + this.addClientForm.value.c_alias;
    url = url + '&' + 'contact=' + String(this.addClientForm.value.c_contact).replace(/\D+/g, '');
    url = url + '&' + 'alternate_number=' + String(this.addClientForm.value.c_alt_no).replace(/\D+/g, '');
    url = url + '&' + 'email=' + this.addClientForm.value.c_email;
    url = url + '&' + 'notes=' + this.addClientForm.value.c_notes;
    url = url + '&' + 'b_state=' + this.addClientForm.value.c_state_billing;
    url = url + '&' + 'b_city=' + this.addClientForm.value.c_city_billing;
    url = url + '&' + 'b_pin_code=' + this.addClientForm.value.c_zipcode_billing;
    url = url + '&' + 'b_streetNoName=' + this.addClientForm.value.c_street_billing;
    url = url + '&' + 'case_reg_date=' + this.addClientForm.value.c_date;

    url = url + '&' + 'session_id=' + this.loggedInUser.id;

    if (this.hasRelation && this.totalEntities > 0)
    {
      for (let i = 0; i < this.totalEntities; i++)
      {
        //Changing the contact number br-masker
        this.addClientForm.get('entity')['controls'][i].controls.e_contact.setValue(String(this.addClientForm.get('entity')['controls'][i].value.e_contact).replace(/\D+/g, ''));
        this.addClientForm.get('entity')['controls'][i].controls.e_alt_no.setValue(String(this.addClientForm.get('entity')['controls'][i].value.e_alt_no).replace(/\D+/g, ''));

      }

      console.log("-----Client Data---");
      console.log(this.addClientForm.value);
      console.log("-----Entity Data---");
      console.log(this.addClientForm.value.entity);
      console.log(JSON.stringify(this.addClientForm.value.entity));

      url = url + '&' + 'relationship[]=' + JSON.stringify(this.addClientForm.value.entity);
      url = url + '&' + 'client_group=' + 'ENTITY';
    }
    else
    {
      url = url + '&' + 'relationship[]=' + '';
      url = url + '&' + 'client_group=' + 'INDIVIDUAL';
    }

    console.log('------Generated URL------')
    console.log(url);
    return url;
  }
}
