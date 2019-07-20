import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { LoadingController, Events } from "ionic-angular";
import "rxjs/add/operator/map";

import { ToastController } from 'ionic-angular';

import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiValuesProvider } from '../../providers/api-values/api-values';

import { CaseTypeProvider } from '../../providers/case-type/case-type';
import { CaseType } from '../../models/case_type.model';
import { AdvocateDropdown } from '../../models/ advocate.model';
import { Client } from '../../models/client.model';



@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage
{

  userForm: FormGroup;
  caseTypeList: CaseType[] = [];
  isNew: boolean = true;
  advocate_list: AdvocateDropdown[] = [];

  constructor
    (
    public platform: Platform,
    public formBuilder: FormBuilder,
    public apiValue: ApiValuesProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public caseTypeProvider: CaseTypeProvider,
    public events: Events
  ) 
  {
    
    //-------Getting Case type list from Provider----------

    this.caseTypeList = this.caseTypeProvider.caseTypeList;
    if (this.caseTypeList.length == 0)
    {
      console.log('--Case type list is empty--');
      const loader = this.loading.create(
        {
          content: 'Loading...',
          duration:15000
        });
      let loadingSuccessful = false;//To know whether timeout occured or not

      loader.present();

      this.caseTypeProvider.fetchList();

      this.events.subscribe('get_case_types', data =>
      {
        
        loadingSuccessful = true;
        loader.dismiss();

        if (data)
        {
          this.caseTypeList = this.caseTypeProvider.caseTypeList;
          console.log('--Got case type list--');
        }
        else
        {
          this.presentToast('Failure!!!');
        }
      });

      loader.onDidDismiss(() =>
      {
        if (!loadingSuccessful)
        {
          this.presentToast('Timeout!!! Server did not respond');
        }
      });
      
    }

    this.userForm = this.formBuilder.group({

      
      u_name: new FormControl('', Validators.compose([Validators.required])),
      u_dob: new FormControl('', Validators.compose([Validators.required])),
      u_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      u_alt: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      u_email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
      u_street: new FormControl('', Validators.compose([Validators.required])),
      u_city: new FormControl('', Validators.compose([Validators.required])),
      u_state: new FormControl('', Validators.compose([Validators.required])),
      u_pincode: new FormControl('', Validators.compose([Validators.required])),
      u_country: new FormControl('', Validators.compose([Validators.required])),

      u_alien: new FormControl(''),
      u_case_type: new FormControl(''),
      u_case_manager: new FormControl('')

    });

  }

  setIsNew(val: boolean)
  {
    if (val)
    {
      //New Client
      this.isNew = true;
    }
    else
    {
      //Existing Client
      this.isNew = false;
      if (this.advocate_list.length == 0)
      {
        this.getCaseManagerList();
      }
    }

  }

  submitData()
  {

    //Validating data
    if (!this.userForm.valid)
    {
      this.presentAlert('Please fill all fields in the form');
      return;
    }

    //The following code will run only if the details entered are valid


    var headers = new Headers();
    let options = new RequestOptions({ headers: headers });



    /* let data = {

         full_name: this.u_name,
         email: this.u_email,
         contact: this.u_contact,
         alt: this.u_alt,
         gender: this.u_gender,
         date_of_birth: this.u_dob,
         country: this.u_country,
         state: this.u_state,
         city: this.u_city,
         pincode: this.u_pincode,
         fax: this.u_fax,
         street: this.u_street,
               street_name: this.u_street_name,
         apartment: this.u_apartment,
         user_type: this.u_user_type,
         profile_image:'shabnam_saifi.jpg'

      };
      */
    let body = new FormData();
    body.append("full_name", this.userForm.value.u_name);
    body.append("email", this.userForm.value.u_email);
    body.append("contact", String(this.userForm.value.u_contact).replace(/\D+/g, ''));

    console.log('Contact value Sent=' + String(this.userForm.value.u_contact).replace(/\D+/g, ''));

    body.append("alt", '' + String(this.userForm.value.u_alt).replace(/\D+/g, ''));
    body.append("gender", this.userForm.value.u_gender);
    body.append("date_of_birth", this.userForm.value.u_dob);
    body.append("country", this.userForm.value.u_country);
    body.append("state", this.userForm.value.u_state);
    body.append("city", this.userForm.value.u_city);
    body.append("pincode", this.userForm.value.u_pincode);
    body.append("fax", this.userForm.value.u_fax);
    body.append("street", this.userForm.value.u_street);
    body.append("user_type", this.userForm.value.u_user_type);
    body.append("profile_image", '');
  


    /* body.append("full_name","Sudhanshu");
    body.append("email","ghsan@gmail.com");
    body.append("contact",9897367892);
    body.append("alt",9872658974);
    body.append("gender","Male");
    body.append("date_of_birth","2000-10-10");
    body.append("country",321);
    body.append("state","saddsd");
    body.append("city","sdwiewqmsd");
    body.append("pincode",76787);
    body.append("fax",8626756389);
    body.append("street",34);
    body.append("street_name","Kamal Namgew");
    body.append("apartment","Unisd wewq");
    body.append("user_type",2);
    body.append(" profile_image",'shabnam_saifi.jpg'); 
	
            console.log("PRinting Body");
    console.log(body); 
    */
    let loader = this.loading.create({

      content: "Adding user please wait…",
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether timeout occured
    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/add_user", body, options) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          loader.dismiss()

          console.log(serverReply);

          const toast = this.toastCtrl.create({
            message: serverReply.message,
            duration: 3000
          });
          toast.present();

          if ('code' in serverReply && serverReply.code == 200) 
          {
            //Successfully created user
            this.navCtrl.pop();
          }
        });

    }, error =>
      {
        loadingSuccessful = true;
        loader.dismiss();
        this.presentToast('Failed to add user');


      });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentToast('Timeout!!! Server did not respond');
      }
    });
  }

  presentAlert(text)
  {
    const alert = this.alertCtrl.create({
      message: text,
      title: 'Error!',
      buttons: [{
        text: 'ok'
      }]
    });
    alert.present();
  }

  presentToast(text)
  {
    const toast = this.toastCtrl.create({

      message: text,
      duration: 3000
    });
    toast.present();
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

      content: "Loading...",
      duration:15000

    });
    let loadingSuccessful = false; //To know whether timeout occured or not

    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/get_advocate.php", data, options) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable
        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          console.log(serverReply);
          this.advocate_list = serverReply;
          loader.dismiss();

        });

    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentToast('Timeout!!! Server did not respond');
      }

    });
  }

  searchForExistingClient()
  {
    //Searching for existing client

    var headers = new Headers();

    headers.append("Accept", "application/json");

    headers.append("Content-Type", "application/json");

    let options = new RequestOptions({ headers: headers });



    //Data to be sent to the server

    let body = new FormData();
    body.append('case_type','');
    body.append('year','');
    body.append('case_category','');
    body.append('advocate_id', '');
    body.append('keyword', this.userForm.value.u_alien);

    console.log('Keyword:' + this.userForm.value.u_alien);


    let loader = this.loading.create({

      content: "Loading ...",
      duration: 10000

    });
    let loadingSuccessful = false;//To know whether timeout occured or not
    loader.present().then(() => 
    {

      this.http.post(this.apiValue.baseURL + "/search_client.php", body, null) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          loadingSuccessful = true;
          console.log(serverReply);
          loader.dismiss();

          if ('code' in serverReply && serverReply.code != 200)
          {
            this.presentAlert(serverReply.message)
          }
          else
          {
            let clients: Client[] = serverReply;
            if (clients == undefined || clients == null || clients.length == 0)
            {
              this.presentAlert('No Record Found');
            }
            else if (clients.length > 1)
            {
              //More than 1 entries are found
              this.presentAlert('Multiple Entries Found');
            }
            else
            {
              //Only 1 entry found
              this.setFormValues(clients[0]);
              this.presentToast("Record Found");
            }
          }
          

        }, error =>
          {
            loadingSuccessful = true;
            console.log(error);

            this.presentToast('Error in getting data');
            loader.dismiss();

          });

    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        this.presentToast('Timeout!!! Server did not respond');
      }
    });

  }

  setFormValues(client: Client)
  {
    this.userForm.controls.u_name.setValue(client.client_name);
    this.userForm.controls.u_contact.setValue(client.contact);
    this.userForm.controls.u_email.setValue(client.email);
    this.userForm.controls.u_case_type.setValue(this.caseTypeProvider.getCaseTypeNo(client.case_type));
    this.userForm.controls.u_case_manager.setValue(client.adv_assign);

    this.userForm.updateValueAndValidity();
    
  }


}
