import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import "rxjs/add/operator/map";


import { User } from '../../../../models/login_user.model';
import { CaseType } from '../../../../models/case_type.model';

import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';
import { CaseTypeProvider } from '../../../../providers/case-type/case-type';
import { Client, ClientDetails, Entity } from '../../../../models/client.model';
import { AdvocateDropdown } from '../../../../models/ advocate.model';

import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { ClientEntityRelationshipProvider} from '../../../../providers/client-entity-relationship/client-entity-relationship';
import { EntityTypeProvider } from '../../../../providers/entity-type/entity-type';
import { EntityType } from '../../../../models/entity_type.model';

import { StateListProvider } from '../../../../providers/state-list/state-list';
import { State } from '../../../../models/state.model';

import { BrContactMaskPipe } from '../../../../pipes/br-contact-mask/br-contact-mask';


@Component
  ({
    selector: 'edit_client',
    templateUrl:'edit_client.html'
})
export class EditClientPage
{

  stateList: State[] = [];

  advocate_list: any=[];
  passedClient: Client;
  passedClientDetails: ClientDetails;
  passedEntities: Entity[] = [];

  editClientForm: FormGroup;
  addEntityForm: FormArray;

  loggedInUser: User;

  showCaseDetails: boolean = true;
  showPersonalDetails: boolean = false;
  showParmanentAddressDetails: boolean = false;
  showCaseManagerDetails: boolean = false;
  showDefendantDetails: boolean = false;
  showEntityDetails: boolean = false;
  showEachEntityDetails: boolean[] = [];

  isBillingAndPermanentAddressSame: boolean = false;
  isBillingAndPermanentAddressSameForEntity: boolean[] = [];

  totalEntities: number = 0;

  relationshipList: any;

  caseTypeList: CaseType[]=[];

  entityTypeList: EntityType[] = [];

  hasRelation: boolean = true;

  documentHasLoaded = false; //To check whether the page has finished loading or not

  constructor(
    public myStorage: MyStorageProvider,
    public caseTypeProvider: CaseTypeProvider,
    public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private http: Http,
    public loading: LoadingController,
    public relationshipProvider: ClientEntityRelationshipProvider,
    public entityTypeProvider: EntityTypeProvider,
    public stateListProvider: StateListProvider,
    public events: Events,
    public brMasker: BrContactMaskPipe

  )
  {
    this.documentHasLoaded = true;
    this.entityTypeList = this.entityTypeProvider.getList();

    //------------------Gettting State List from Provider---------//

    this.stateList = this.stateListProvider.stateList;
    if (this.stateList == undefined || this.stateList.length == 0)
    {
      this.events.publish('getStateList'); //This event is subscribed to in the app.component page
    }

    this.editClientForm = this.formBuilder.group({

      //Case details
      c_case_type: new FormControl('', Validators.compose([Validators.required])),
      c_alien_no: new FormControl(''),
      c_client_type: new FormControl(''),
      c_case_category: new FormControl('', Validators.compose([Validators.required])),
      c_case_description: new FormControl(''),
      c_date: new FormControl('', Validators.compose([Validators.required])),

      //personal Details
      c_name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      c_lastname: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      c_alias: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      c_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      c_alt_no: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      c_email: new FormControl('', Validators.compose([Validators.pattern(/^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
      c_notes: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.LONG_TEXT_VALIDATOR)])),
      c_country: new FormControl('', Validators.compose([Validators.required])),
      c_address1: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      c_address2: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      c_city: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      c_state: new FormControl('', Validators.compose([Validators.required])),
      c_zipcode: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.ZIPCODE_VALIDATOR)])),
      c_country_billing: new FormControl('', Validators.compose([Validators.required])),
      c_address1_billing: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      c_address2_billing: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      c_city_billing: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      c_state_billing: new FormControl('', Validators.compose([Validators.required])),
      c_zipcode_billing: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.ZIPCODE_VALIDATOR)])),

      //Entities
      entity: this.formBuilder.array([]),

      //Case Manager Details
      c_filing_cm: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      c_cm_assigned: new FormControl('', Validators.compose([Validators.required])),

      //Defendant Details
      c_defendent_name: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      c_defendent_alias: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      c_defendent_manager: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),

     // c_reg_fee: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])),
     // c_decided_fee: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]))

    });

    this.editClientForm.controls.c_country.setValue('United States');
    this.editClientForm.controls.c_country_billing.setValue('United States');


    if (this.caseTypeProvider.isEmpty)
    {
      this.showToast('Failure!!! Cannot get case types');
    }
    this.caseTypeList = this.caseTypeProvider.caseTypeList;


    this.getCaseManagerList();
    this.relationshipList = this.relationshipProvider.getAllRelationships();
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad()
  {
    
    console.log("In Edit Client ion View Did Load");
    this.passedClient = this.navParams.get('client');
    this.passedClientDetails = this.navParams.get('clientDetails');
    this.passedEntities = this.navParams.get('entityDetails');

    console.log(this.passedClient);
    console.log(this.passedClientDetails);
    console.log(this.passedEntities);

    this.setClientDetails(this.passedClientDetails); //Change the form Values
    this.setEntityDetails(this.passedEntities); //Change the form values for each client

  }


  setClientDetails(clientDetails: ClientDetails)
  {
    //Passing the value will make this method generic

    //Case details

    this.editClientForm.controls.c_case_type.setValue(this.caseTypeProvider.getCaseTypeNo(this.passedClientDetails.case_type)); //Client Details returns thge string of the Case Type
    this.editClientForm.controls.c_alien_no.setValue(this.passedClientDetails.case_no); //Case number and Alien Numbers are same
    this.editClientForm.controls.c_client_type.setValue(this.passedClientDetails.client_type);
    this.editClientForm.controls.c_case_category.setValue(this.passedClientDetails.case_category);
    this.editClientForm.controls.c_case_description.setValue(this.passedClientDetails.case_desc);
    this.editClientForm.controls.c_date.setValue(this.passedClientDetails.case_reg_date);
      
    //personal Details
    this.editClientForm.controls.c_name.setValue(this.passedClientDetails.name);
    this.editClientForm.controls.c_lastname.setValue(this.passedClientDetails.lastname);
    this.editClientForm.controls.c_alias.setValue(this.passedClientDetails.alias);
    //--Masking Contact--//
    this.editClientForm.controls.c_contact.setValue(this.brMasker.transform(this.passedClientDetails.contact));
    this.editClientForm.controls.c_alt_no.setValue(this.brMasker.transform(this.passedClientDetails.alternate_number));
    this.editClientForm.controls.c_email.setValue(this.passedClientDetails.email);
    this.editClientForm.controls.c_notes.setValue(this.passedClientDetails.notes);
   // this.editClientForm.controls.c_country.setValue(this.passedClientDetails.country);
    this.editClientForm.controls.c_address1.setValue(this.passedClientDetails.permanent_addressLine1);
    this.editClientForm.controls.c_address2.setValue(this.passedClientDetails.permanent_addressLine2);

    this.editClientForm.controls.c_city.setValue(this.passedClientDetails.city);
    this.editClientForm.controls.c_state.setValue(this.passedClientDetails.state);
    this.editClientForm.controls.c_zipcode.setValue(this.passedClientDetails.zipCode);

   // this.editClientForm.controls.c_country_billing.setValue(this.passedClientDetails.country);
    this.editClientForm.controls.c_address1_billing.setValue(this.passedClientDetails.mailing_addressLine1);
    this.editClientForm.controls.c_address2_billing.setValue(this.passedClientDetails.mailing_addressLine2);

    this.editClientForm.controls.c_city_billing.setValue(this.passedClientDetails.cityB);
    this.editClientForm.controls.c_state_billing.setValue(this.passedClientDetails.stateB);
    this.editClientForm.controls.c_zipcode_billing.setValue(this.passedClientDetails.zipCodeB);

    //Case Manager Details
    this.editClientForm.controls.c_filing_cm.setValue(this.passedClientDetails.fillingAdvocate_name);
    let advocate = this.advocate_list.find(adv => String(adv.name) === String(this.passedClientDetails.caseManagerName)); //For mapping Advocate name with his ID

    if (advocate != null && advocate != undefined)
    {
      this.editClientForm.controls.c_cm_assigned.setValue(advocate.id);
    }

    //Defendant Details
    this.editClientForm.controls.c_defendent_name.setValue(this.passedClientDetails.defendentName);
    this.editClientForm.controls.c_defendent_alias.setValue(this.passedClientDetails.defendentAlias);
    this.editClientForm.controls.c_defendent_manager.setValue(this.passedClientDetails.op_adv_name);

    //this.editClientForm.controls.c_reg_fee.setValue(this.passedClientDetails.registration_fee);
    //this.editClientForm.controls.c_decided_fee.setValue(this.passedClientDetails.decided_fee);

    this.editClientForm.updateValueAndValidity();
  }

  setEntityDetails(entities: Entity[])
  {
    for (let i = 0; i < entities.length; i++)
    {
      this.addEntities(); //Add a new entity in the form
      this.setPassedEntityDetails(entities[i],i);
    }
  }

  setPassedEntityDetails(entity: Entity,index)
  {
    this.editClientForm.get('entity')['controls'][index].controls.e_type.setValue(entity.entity_type);
    this.editClientForm.get('entity')['controls'][index].controls.e_relationship.setValue(entity.relationship);

    //personal Details
    
    this.editClientForm.get('entity')['controls'][index].controls.e_name.setValue(entity.name);
    this.editClientForm.get('entity')['controls'][index].controls.e_name.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_lastname.setValue(entity.lastname);
    this.editClientForm.get('entity')['controls'][index].controls.e_lastname.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_alias.setValue(entity.alias);
    this.editClientForm.get('entity')['controls'][index].controls.e_alias.updateValueAndValidity();

        //---Masking Contact--//
    this.editClientForm.get('entity')['controls'][index].controls.e_contact.setValue(this.brMasker.transform(entity.contact));
        this.editClientForm.get('entity')['controls'][index].controls.e_contact.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_alt_no.setValue(this.brMasker.transform(entity.alternate_number));
        this.editClientForm.get('entity')['controls'][index].controls.e_alt_no.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_email.setValue(entity.email);
    this.editClientForm.get('entity')['controls'][index].controls.e_email.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_notes.setValue(entity.notes);
    this.editClientForm.get('entity')['controls'][index].controls.e_notes.updateValueAndValidity();

   
    this.editClientForm.get('entity')['controls'][index].controls.e_address1.setValue(entity.permanent_addressLine1);
    this.editClientForm.get('entity')['controls'][index].controls.e_address1.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_address2.setValue(entity.permanent_addressLine2);
    this.editClientForm.get('entity')['controls'][index].controls.e_address2.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_city.setValue(entity.city);
    this.editClientForm.get('entity')['controls'][index].controls.e_city.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_state.setValue(entity.state);
    this.editClientForm.get('entity')['controls'][index].controls.e_state.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_zipcode.setValue(entity.zipCode);
    this.editClientForm.get('entity')['controls'][index].controls.e_zipcode.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_address1_billing.setValue(entity.mailing_addressLine1);
    this.editClientForm.get('entity')['controls'][index].controls.e_address1_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_address2_billing.setValue(entity.mailing_addressLine2);
    this.editClientForm.get('entity')['controls'][index].controls.e_address2_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_city_billing.setValue(entity.cityB);
    this.editClientForm.get('entity')['controls'][index].controls.e_city_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_state_billing.setValue(entity.stateB);
    this.editClientForm.get('entity')['controls'][index].controls.e_state_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][index].controls.e_zipcode_billing.setValue(entity.zipCodeB);
    this.editClientForm.get('entity')['controls'][index].controls.e_zipcode_billing.updateValueAndValidity();

  }

  changeRelation(val: boolean)
  {
    //This method is no longer useful because client(DSD Firm) has asked to allow addition of entities in each case

    /*
     * This method is used to change the relation of the client i.e. whether he is the only one associated with the case or multiple people are associated with him
     */

    this.hasRelation = val;
    return;

    //Following code was used to set the relation validators
    /*
    if (!this.hasRelation)
    {
      //If the user has changed the case type from relation to individual, we need to remove validators on entities.
      if (this.totalEntities > 0)
      {
        let loader = this.loading.create({

          content: 'Please Wait...',
          duration: 10000
        });

        let loadingSuccessful = false; //To know whether loading timeout occured 

        loader.present().then(() =>
        {
          for (let i = 0; i < this.totalEntities; i++)
          {
            this.setEntityValidatorsNull(i, 'e_relationship');
            this.setEntityValidatorsNull(i, 'e_type');
            this.setEntityValidatorsNull(i, 'e_name');
            this.setEntityValidatorsNull(i, 'e_alias');
            this.setEntityValidatorsNull(i, 'e_contact');
            this.setEntityValidatorsNull(i, 'e_alt_no');
            this.setEntityValidatorsNull(i, 'e_email');
            this.setEntityValidatorsNull(i, 'e_notes');
            this.setEntityValidatorsNull(i, 'e_country');
            this.setEntityValidatorsNull(i, 'e_address1');
            this.setEntityValidatorsNull(i, 'e_address2');
            this.setEntityValidatorsNull(i, 'e_city');
            this.setEntityValidatorsNull(i, 'e_state');
            this.setEntityValidatorsNull(i, 'e_zipcode');
            this.setEntityValidatorsNull(i, 'e_country_billing');
            this.setEntityValidatorsNull(i, 'e_address1_billing');
            this.setEntityValidatorsNull(i, 'e_address2_billing');
            this.setEntityValidatorsNull(i, 'e_city_billing');
            this.setEntityValidatorsNull(i, 'e_state_billing');
            this.setEntityValidatorsNull(i, 'e_zipcode_billing');
          }
          loadingSuccessful = true;
          loader.dismiss();
        });

        loader.onDidDismiss(() =>
        {

          if (!loadingSuccessful)
          {
            this.showToast('Internal Error!!!');
          }

        });
      }

    }

    */
  }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  setEntityValidatorsNull(i, _fControl)
  {
    this.editClientForm.get('entity')['controls'][i].get(_fControl).setValidators(null);
    this.editClientForm.get('entity')['controls'][i].get(_fControl).updateValueAndValidity();

  }

  makeAlertDialog(message)
  {
    let alert = this.alertCtrl.create({

      title: "ATTENTION",

      message: message,

      buttons: ["OK"]

    });

    alert.present();

  }

  getCaseManagerList()
  {
    this.advocate_list = [];

    var headers = new Headers();

    headers.append("Accept", "application/json");

    headers.append("Content-Type", "application/json");

    let options = new RequestOptions({ headers: headers });

    let data =
    {

    };
    let loader = this.loading.create({

      content: "Loading…",
      duration:15000

    });
    let loadingSuccessful = false;//To know timeout occured or not

    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/get_advocate.php", data, options) //Http request returns an observable

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
              }
              else
              {
                this.advocate_list = response;
                let advocate = this.advocate_list.find(adv => String(adv.name) === String(this.passedClientDetails.caseManagerName)); //For mapping Advocate name with his ID
                if (advocate != null && advocate != undefined)
                {
                  this.editClientForm.controls.c_cm_assigned.setValue(advocate.id);
                }
              }
              
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Error!!!');
            }
          }
          else
          {
            this.showToast('Error!!!');
          }
          

        }, error =>
          {
            loadingSuccessful = true;
            loader.dismiss();
            console.log(error);
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

  toggleShowMore(id)
  {
    switch (id)
    {
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
    this.isBillingAndPermanentAddressSame = !this.isBillingAndPermanentAddressSame;

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
    this.editClientForm.controls.c_country_billing.setValue(this.editClientForm.value.c_country);
    this.editClientForm.controls.c_country_billing.updateValueAndValidity();

    this.editClientForm.controls.c_address1_billing.setValue(this.editClientForm.value.c_address1);
    this.editClientForm.controls.c_address1_billing.updateValueAndValidity();

    this.editClientForm.controls.c_address2_billing.setValue(this.editClientForm.value.c_address2);
    this.editClientForm.controls.c_address2_billing.updateValueAndValidity();

    this.editClientForm.controls.c_city_billing.setValue(this.editClientForm.value.c_city);
    this.editClientForm.controls.c_city_billing.updateValueAndValidity();

    this.editClientForm.controls.c_state_billing.setValue(this.editClientForm.value.c_state);
    this.editClientForm.controls.c_state_billing.updateValueAndValidity();

    this.editClientForm.controls.c_zipcode_billing.setValue(this.editClientForm.value.c_zipcode);
    this.editClientForm.controls.c_zipcode_billing.updateValueAndValidity();
  }

  copyEntityAddresses(i)
  {
    console.log("Index" + i);
    this.editClientForm.get('entity')['controls'][i].controls.e_country_billing.setValue(this.editClientForm.get('entity')['controls'][i].value.e_country);
    this.editClientForm.get('entity')['controls'][i].controls.e_country_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][i].controls.e_address1_billing.setValue(this.editClientForm.get('entity')['controls'][i].value.e_address1);
    this.editClientForm.get('entity')['controls'][i].controls.e_address1_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][i].controls.e_address2_billing.setValue(this.editClientForm.get('entity')['controls'][i].value.e_address2);
    this.editClientForm.get('entity')['controls'][i].controls.e_address2_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][i].controls.e_city_billing.setValue(this.editClientForm.get('entity')['controls'][i].value.e_city);
    this.editClientForm.get('entity')['controls'][i].controls.e_city_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][i].controls.e_state_billing.setValue(this.editClientForm.get('entity')['controls'][i].value.e_state);
    this.editClientForm.get('entity')['controls'][i].controls.e_state_billing.updateValueAndValidity();

    this.editClientForm.get('entity')['controls'][i].controls.e_zipcode_billing.setValue(this.editClientForm.get('entity')['controls'][i].value.e_zipcode);
    this.editClientForm.get('entity')['controls'][i].controls.e_zipcode_billing.updateValueAndValidity();
  }

  initializeEntityForm(): FormGroup
  {
    let newEntity: FormGroup = new FormBuilder().group({

      e_type: new FormControl('', Validators.required),
      e_relationship: new FormControl('', Validators.required),

      //personal Details
      e_name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      e_lastname: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      e_alias: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      e_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      e_alt_no: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      e_email: new FormControl('', Validators.compose([Validators.pattern(/^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
      e_notes: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.LONG_TEXT_VALIDATOR)])),
      e_country: new FormControl('', Validators.compose([Validators.required])),
      e_address1: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      e_address2: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      e_city: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      e_state: new FormControl('', Validators.compose([Validators.required])),
      e_zipcode: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.ZIPCODE_VALIDATOR)])),
      e_country_billing: new FormControl('', Validators.compose([Validators.required])),
      e_address1_billing: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      e_address2_billing: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      e_city_billing: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      e_state_billing: new FormControl('', Validators.compose([Validators.required])),
      e_zipcode_billing: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.ZIPCODE_VALIDATOR)])),

    });

    return newEntity
  }

  addEntities()
  {

    let newEntity: FormGroup = this.initializeEntityForm();
    newEntity.controls.e_country.setValue('United States');
    newEntity.controls.e_country_billing.setValue('United States');
    console.log('New Entity Copuntry Value'+newEntity.value.e_country_billing);
    this.addEntityForm = this.editClientForm.get('entity') as FormArray;
    this.addEntityForm.push(newEntity);
    this.showEntityDetails = true;

    //Lastly We will increase entities
    this.isBillingAndPermanentAddressSameForEntity.push(false);
    this.showEachEntityDetails.push(false);
    this.totalEntities++;
    this.hasRelation = true;
  }

  removeEntity(index)
  {
    this.addEntityForm = this.editClientForm.get('entity') as FormArray;

    this.isBillingAndPermanentAddressSameForEntity.splice(index, 1);//Remove from the same address array
    this.showEachEntityDetails.splice(index, 1);//Remove from the visibility array
    this.addEntityForm.removeAt(index); //Remove 1 item at the index from the array
    this.totalEntities--;
    if (this.totalEntities <= 0)
    {
      this.changeRelation(false);
    }
  }

  submitData()
  {

    if(!this.editClientForm.valid)
    {
      //Form is invalid

      this.makeAlertDialog('Invalid inputs! Please correct your values');
      return;
    }
    //Following lines will execute only if the form fields are correct

    let body = new FormData();  //Data to be sent to the server
    let loader = this.loading.create({

      content: "Updating client please wait…",
      duration: 15000

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
                  //Updated successfully
                  this.navCtrl.getPrevious().data.reload = true;
                  this.navCtrl.pop();
                }
              }
              else
              {
                this.showToast("Failed to update client");
              }
            }
            catch (err)
            {
              this.showToast("Failed to update client");
            }


          }
          else
          {
            this.showToast("Failed to update client");
          }



        }, error =>
          {
            loadingSuccessful = true;
            loader.dismiss();
            this.showToast("Failed to update client");
          });

    });
  }

  makeSubmitURL():string
  {
    let url = this.apiValue.baseURL + '/edit_client.php?';

    url = url + 'case_type=' + this.editClientForm.value.c_case_type;

    url = url + '&case_no='+this.editClientForm.value.c_alien_no;
    url = url + '&case_category=' + this.editClientForm.value.c_case_category;

    url = url + '&' + 'adv_assign='+ this.editClientForm.value.c_cm_assigned;
    url = url + '&' + 'op_full_name='+ this.editClientForm.value.c_defendent_name;
    url = url + '&' + 'first_name='+ this.editClientForm.value.c_name;
    url = url + '&' + 'last_name='+ this.editClientForm.value.c_lastname;

    url = url + '&' + 'p_address1=' + this.editClientForm.value.c_address1;
    url = url + '&' + 'p_address2=' + this.editClientForm.value.c_address2;

    url = url + '&' + 'p_city='+ this.editClientForm.value.c_city;
    url = url + '&' + 'p_state='+this.editClientForm.value.c_state;
    url = url + '&' + 'p_pin_code='+this.editClientForm.value.c_zipcode;
    url = url + '&' + 'p_country='+ this.editClientForm.value.c_country;
    url = url + '&' + 'filing_adv_name='+ this.editClientForm.value.c_filing_cm;
    url = url + '&' + 'client_type='+ this.editClientForm.value.c_client_type;
    url = url + '&' + 'case_desc='+ this.editClientForm.value.c_case_description;
    url = url + '&' + 'op_alias='+ this.editClientForm.value.c_defendent_alias;
    url = url + '&' + 'op_adv_name='+ this.editClientForm.value.c_defendent_manager;
    //url = url + '&' + 'registration_fee='+ this.editClientForm.value.c_reg_fee;
    //url = url + '&' + 'decided_fee='+ this.editClientForm.value.c_decided_fee;
    url = url + '&' + 'alias='+ this.editClientForm.value.c_alias;
    url = url + '&' + 'contact='+ String(this.editClientForm.value.c_contact).replace(/\D+/g, '');
    url = url + '&' + 'alternate_number='+ String(this.editClientForm.value.c_alt_no).replace(/\D+/g, '');
    url = url + '&' + 'email='+ this.editClientForm.value.c_email;
    url = url + '&' + 'notes='+ this.editClientForm.value.c_notes;
    url = url + '&' + 'b_state='+ this.editClientForm.value.c_state_billing;
    url = url + '&' + 'b_city='+ this.editClientForm.value.c_city_billing;
    url = url + '&' + 'b_pin_code='+ this.editClientForm.value.c_zipcode_billing;
    url = url + '&' + 'b_address1=' + this.editClientForm.value.c_address1_billing;
    url = url + '&' + 'b_address2=' + this.editClientForm.value.c_address2_billing;
    url = url + '&' + 'case_reg_date='+ this.editClientForm.value.c_date;

    url = url + '&' + 'cid='+ String(this.passedClient.id);
    url = url + '&' + 'session_id='+this.loggedInUser.id;

    if(this.totalEntities > 0)
    {
      for (let i = 0; i < this.totalEntities; i++)
      {
        //Changing the contact number br-masker
        this.editClientForm.get('entity')['controls'][i].controls.e_contact.setValue(String(this.editClientForm.get('entity')['controls'][i].value.e_contact).replace(/\D+/g, ''));
        this.editClientForm.get('entity')['controls'][i].controls.e_alt_no.setValue(String(this.editClientForm.get('entity')['controls'][i].value.e_alt_no).replace(/\D+/g, ''));

      }

      console.log("-----Client Data---");
      console.log(this.editClientForm.value);
      console.log("-----Entity Data---");
      console.log(this.editClientForm.value.entity);
      console.log(JSON.stringify(this.editClientForm.value.entity));

      url = url + '&' + 'relationship[]='+JSON.stringify(this.editClientForm.value.entity);
      url = url + '&' + 'client_group='+ 'ENTITY';
    }
    else
    {
      url = url + '&' + 'relationship[]='+ '';
      url = url + '&' + 'client_group='+ 'INDIVIDUAL';
    }

    console.log('------Generated URL------')
    console.log(url);
    return url;
  }

  isEntityValid(index, fieldName)
  {
    if (!this.documentHasLoaded)
    {
      return false;
    }
    return this.editClientForm.get('entity')['controls'][index]['controls'][fieldName].valid;
  }
}
