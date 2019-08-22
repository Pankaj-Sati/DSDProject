import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Validators, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { ToastController, Events } from 'ionic-angular';
import "rxjs/add/operator/map";

import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer'
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../providers/my-storage/my-storage';
import { CountryProvider } from '../../../providers/country/country';

import { StateListProvider } from '../../../providers/state-list/state-list';
import { State } from '../../../models/state.model';

import { User, UserDetails } from '../../../models/login_user.model';

import { Storage } from '@ionic/storage';
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { BrContactMaskPipe } from '../../../pipes/br-contact-mask/br-contact-mask';

declare var cordova: any;

@Component({
  selector: 'edit_profile',
  templateUrl: 'edit_profile.html'
})
export class EditProfilePage
{
  stateList: State[] = [];

  user: UserDetails; //To store the details of the user

  loggedInUserId; //To store the ID of the logged-in user

  loggedInUser: User; //To store basic info abouit the logged in user

  passed_uid: string;

  userForm: FormGroup;

  updateSuccessful = false; //TO know whether user has updated the data or not

  isImageChanged: boolean = false; //To know whether the user changed the image or not

  win: any = window;

  lastImage: string;


  constructor(public webView: WebView,
    public events: Events,
    public storage: Storage,
    public file: File,
    public platform: Platform,
    public filePath: FilePath,
    public fileTransfer: FileTransfer,
    public formBuilder: FormBuilder,
    public apiValue: ApiValuesProvider,
    private camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    public loading: LoadingController,
    public toastCtrl: ToastController,
    public myStorage: MyStorageProvider,
    public menuCtrl: MenuController,
    public countryProvider: CountryProvider,
    public stateListProvider: StateListProvider,
    public brMasker: BrContactMaskPipe) 
  {

    //------------------Gettting State List from Provider---------//

    this.stateList = this.stateListProvider.stateList;
    if (this.stateList == undefined || this.stateList.length == 0)
    {
      this.events.publish('getStateList'); //This event is subscribed to in the app.component page
    }


    this.userForm = this.formBuilder.group({

      u_profile_img: new FormControl(''),
      u_name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      u_lastname: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),

      u_email: new FormControl('', Validators.compose([Validators.pattern(/^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
      u_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      u_alt: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      u_gender: new FormControl(''),
      u_dob: new FormControl(''),
      u_country: new FormControl('', Validators.compose([Validators.required])),
      u_state: new FormControl(''),
      u_city: new FormControl(''),
      u_pincode: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ZIPCODE_VALIDATOR)])),
      u_fax: new FormControl(''),
      u_address1: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      u_address2: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      u_user_type: new FormControl('', Validators.compose([Validators.required]))

    });

    this.userForm.controls.u_country.setValue('United States');

    this.loggedInUser = this.myStorage.getParameters();
    this.loggedInUserId = this.loggedInUser.id;
  }

  get countryList()
  {
    return this.countryProvider.getCountryList();
  }


  ionViewDidLoad()
  {
    //This method is called when the page loads for the first time
    this.user = this.navParams.get('userDetail'); //Get the id field passed from the user_list page
    this.passed_uid = this.navParams.get('user_id'); //Get the id field passed from the user_list page
    console.log("Id received=" + this.passed_uid);
    console.log(this.user);
    
    if (this.passed_uid == null)
    {
      this.presentToast('No user id received');
      this.navCtrl.pop(); //Pop the current page
    }


    if (this.user == undefined || this.user == null)
    {
      this.fetchData();
    }
    else
    {
      this.setFormValues();
    }
    

  }

  takeImage()
  {

    console.log("In take Image()");

    let source = this.camera.PictureSourceType.PHOTOLIBRARY; //Default source type


    let alert = this.alertCtrl.create({
      title: 'Profile Image',
      message: 'Select profile image from:',
      buttons: [
        {
          text: 'Gallery',
          handler: () =>
          {
            console.log('From Gallery');
            this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Camera',
          handler: () =>
          {
            console.log('From camera');
            this.getImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          handler: () =>
          {
            console.log('Cancelled');
            
          }
        }
      ]
    });
    alert.present();


  }

  getImage(source)
  {
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: source
    };

    this.camera.getPicture(options).then((imageData) =>
    {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log("Image get()" + imageData);

      if ((imageData != null || imageData != undefined) && imageData.length > 0)
      {

        //We need to get the native path of the files present in the gallery on Android
        if (this.platform.is('android') && source === this.camera.PictureSourceType.PHOTOLIBRARY) 
        {

          this.filePath.resolveNativePath(imageData)
            .then(filePath => 
            {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

              this.isImageChanged = true; //We have got our image successfully;
              this.userForm.controls.u_profile_img.setValue(this.win.Ionic.WebView.convertFileSrc(imageData));
              this.userForm.controls.u_profile_img.updateValueAndValidity();
              
            })

            .catch(error =>
            {

              console.log("resolveNativePath() error");
              this.presentToast('Error!!!Please select other image');
              console.log(error);
            });



        }
        else 
        {
          var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
          var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          this.isImageChanged = true; //We have got our image successfully;
          this.userForm.controls.u_profile_img.setValue(this.win.Ionic.WebView.convertFileSrc(imageData));
          this.userForm.controls.u_profile_img.updateValueAndValidity();

          

        }
      }
      else
      {
        this.presentToast('Error!!!Please select other image');
      }




    }, (err) =>
    {
      // Handle error
        this.presentToast('Error!!!Please select other image');
    });
  }

  createFileName()
  {
    //This function creates a new name for the selected image file by naming it after the current timestamp
    let date = new Date();
    let name = date.getTime() + ".jpg";
    return name;
  }

  copyFileToLocalDir(correctPath, currentName, newFileName)
  {
    this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, newFileName).then(success =>
    {

      this.lastImage = cordova.file.dataDirectory + newFileName;

    }, error =>
    {

        this.presentToast('Error!!!Please select other image');
    });
  }


  fetchData()
  {

    this.user = null;

    if (this.passed_uid == null)
    {

      this.presentToast('No user Id received'),
      this.navCtrl.pop(); //pop this page from stack
    }

    else
    {
      var headers = new Headers();

      let options = new RequestOptions({ headers: headers });
      let body = new FormData();
      body.append('mode', 'view');
      body.append('session_user_id', this.loggedInUser.id);

      let loader = this.loading.create({

        content: "Loading ...",

      });

      let loadingSuccessful = false;//To know whether timeout occured

      loader.present().then(() => 
      {

        this.http.post(this.apiValue.baseURL + "/profile.php", body, options) //Http request returns an observable

          .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

          {
            console.log('Server Reply');

            console.log(serverReply);
            loadingSuccessful = true;
            loader.dismiss();

            if (serverReply)
            {
              let response = JSON.parse(serverReply['_body']);

              if ("message" in response)
              {
                //Indicates error message sent by the server

                this.presentToast(response.message);

              }
              else
              {
                this.user = response;
                this.setFormValues();
                console.log(this.user);
              }
            }
            else
            {
              this.presentToast('Failed to get data');
              loader.dismiss();
            }

          }, error =>
            {
              loadingSuccessful = true;
              console.log(error);
              this.presentToast('Failed to get data');
              loader.dismiss();
            });

      });

      loader.onDidDismiss(() =>
      {
        if (!loadingSuccessful)
        {
          this.presentToast('Timeout!!! Server did not respond');
          this.navCtrl.pop();//Pop current page
        }
      });

    }


  }

  setFormValues()
  {
    console.log('In set Form Values');
    console.log(this.user);
    
    this.userForm.controls.u_name.setValue(this.user.name);
    this.userForm.controls.u_lastname.setValue(this.user.lastname);
   

    this.userForm.controls.u_email.setValue(this.user.email);
    //------Masking contact--------//
    
    if (this.user.contact != undefined && this.user.contact != null && this.user.contact.length > 0)
    {
      this.userForm.controls.u_contact.setValue(this.brMasker.transform(this.user.contact));
    }

    if (this.user.alternate_number != undefined && this.user.alternate_number != null && this.user.alternate_number.length > 0)
    {
      this.userForm.controls.u_alt.setValue(this.brMasker.transform(this.user.alternate_number));
    }
   
   

    this.userForm.controls.u_gender.setValue(this.user.gender);
    this.userForm.controls.u_dob.setValue(this.user.dob);

    if (this.user.dob != undefined && this.user.dob != null)
    {
      let dob = String(this.user.dob).split(' '); //Split using space
      this.userForm.controls.u_dob.setValue(dob[0]);

    }
    this.userForm.controls.u_dob.setValue(this.user.dob);
    this.userForm.controls.u_address1.setValue(this.user.permanent_addressLine1);
    this.userForm.controls.u_address2.setValue(this.user.permanent_addressLine2);

    this.userForm.controls.u_city.setValue(this.user.city);
    this.userForm.controls.u_state.setValue(this.user.state);
    this.userForm.controls.u_pincode.setValue(this.user.pincode);

    this.userForm.controls.u_country.setValue(this.user.country); //In template the country name is coded in select option
   
    this.userForm.controls.u_fax.setValue(this.user.fax);
    this.userForm.controls.u_user_type.setValue(this.user.usertype_id);
    if (this.user.profile_img != null && this.user.profile_img != undefined && this.user.profile_img.length > 0)
    {
      this.userForm.controls.u_profile_img.setValue(this.apiValue.baseImageFolder + this.user.profile_img);

    }
    this.userForm.updateValueAndValidity();
  }

  submitData()
  {

    console.log("Image changed" + this.isImageChanged);

    if (!this.isImageChanged || this.lastImage == undefined || this.lastImage.length == 0)
    {
      //If image is not changed, we don't need to send data using file transfer

      var headers = new Headers();
      let options = new RequestOptions({ headers: headers });

      let body = new FormData();
      body.set("mode", 'edit');
      body.set("session_user_id", this.loggedInUser.id);

      body.set("first_name", this.userForm.value.u_name);
      body.set("last_name", this.userForm.value.u_lastname);
      body.set("email", this.userForm.value.u_email);
      body.set("contact", String(this.userForm.value.u_contact).replace(/\D+/g, ''));
      body.set("alt", String(this.userForm.value.u_alt).replace(/\D+/g,''));
      body.set("gender", this.userForm.value.u_gender);
      body.set("date_of_birth", this.userForm.value.u_dob);
      body.set("country", this.userForm.value.u_country);
      body.set("state", this.userForm.value.u_state);
      body.set("city", this.userForm.value.u_city);
      body.set("pincode", this.userForm.value.u_pincode);
      body.set("fax", this.userForm.value.u_fax);
      body.set("address1", this.userForm.value.u_address1);
      body.set("address2", this.userForm.value.u_address2);

      body.append("profile_image", this.user.profile_img); //Not changing the profile image
    

      let loader = this.loading.create({

        content: "Updating user please wait…",
        duration:15000

      });

      let loadingSuccessful = false;//To know whether timeout occured or not
      console.log("Body");
      console.log(body);

      console.log("Full name");
      console.log(this.userForm.value.u_name + ' ' + this.userForm.value.u_lastname);

      loader.present().then(() => 
      {

        this.http.post(this.apiValue.baseURL+'/profile.php', body, options) //Http request returns an observable
          .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

          {
            console.log(serverReply);
            loadingSuccessful = true;
            loader.dismiss();
            if (serverReply)
            {
              let response = JSON.parse(serverReply['_body']);
              if ('code' in response)
              {
                if (response.code != 200)
                {
                  //Failure
                  this.presentToast(response.message);
                }
                else
                {
                  //Successful
                  this.updateSuccessful = true;

                  this.updateLoginUserParameters(response.profile_img);
                  if (this.navCtrl.canGoBack())
                  {
                    this.navCtrl.getPrevious().data.reload = true;
                    this.navCtrl.pop();
                  }
                  
                  this.presentToast(response.message);
                }
              }
              else
              {
                //Failure
                this.presentToast('Failed to update user');
              }
            }
            else
            {
              this.presentToast('Failed to update user');
            }
           
          }, error =>
            {
              loadingSuccessful = true;
              loader.dismiss();
              console.log(error);
              this.presentToast('Failed to update user');
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
    else
    {
      //Image has been changed. Therefore we will need file transfer plugin
      let transfer: FileTransferObject = this.fileTransfer.create();

      let filename = this.lastImage.substr(this.lastImage.lastIndexOf('/') + 1);
      var options =
      {
        fileKey: "profile_image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: {

          "mode": 'edit',
          "session_user_id": this.loggedInUser.id,

          "first_name": this.userForm.value.u_name,
          "last_name": this.userForm.value.u_lastname,
          "email": this.userForm.value.u_email,
          "contact": String(this.userForm.value.u_contact).replace(/\D+/g,''),
          "alt": String(this.userForm.value.u_alt).replace(/\D+/g,''),
          "gender": this.userForm.value.u_gender,
          "date_of_birth": this.userForm.value.u_dob,
          "country": this.userForm.value.u_country,
          "state": this.userForm.value.u_state,
          "city": this.userForm.value.u_city,
          "pincode": this.userForm.value.u_pincode,
          "fax": this.userForm.value.u_fax,
          "address1": this.userForm.value.u_address1,
          "address2": this.userForm.value.u_address2,
         
          
        }
      };

      let loader = this.loading.create({

        content: "Updating data...",
        duration: 35000
      });

      let transferSuccessful = false; //To know whether timeout occured or not

      loader.present();
      
      transfer.upload(this.lastImage, this.apiValue.baseURL + '/profile.php', options).then(data =>
      {

        transferSuccessful = true;
        console.log("Image upload server reply");
        console.log(data);
        loader.dismiss();
        if(data)
        {
          try
          {
            console.log('Parsing-------');

            let response = JSON.parse(data["response"]);
            
            console.log(response);
            if (response.code != 200)
            {
              //Error returned from server
              this.presentToast(response.message);
              return;
            }
            else
            {
              //successful
              this.updateSuccessful = true;
              this.presentToast(response.message);
              this.updateLoginUserParameters(response.profile_img);
              loader.dismiss();

              if (this.navCtrl.canGoBack())
              {
                this.navCtrl.getPrevious().data.reload = true;
                this.navCtrl.pop();
              }
              return;
            }
          }
          catch (err)
          {
            console.log('Parsing unsuccessful-------');
            console.log(err);
            this.presentToast("Failed!! Server returned an error");
            loader.dismiss();
          }
          
        }
        else
        {
          console.log('Not in If (data)');
          this.presentToast("Failed!! Server returned an error");
          loader.dismiss();
        }

      }, err =>
      {

        console.log(err);
          transferSuccessful = true;
          console.log('In err=>');
        this.presentToast("Failed!! Server returned an error");
        loader.dismiss();

      })
        .catch(err =>
        {

          transferSuccessful = true;
          console.log(err);
          console.log('In catch(err=>');
          this.presentToast("Failed!! Server returned an error");
          loader.dismiss();

        });

      loader.onDidDismiss((data) =>
      {

        console.log(data);
        if (!transferSuccessful)
        {
          this.presentToast("Timeout!! Check your internet connection");
        }
      });
    }


  }

  updateLoginUserParameters(profileImage)
  {
     this.loggedInUser.name = this.userForm.value.u_name;
    if (this.userForm.value.u_lastname != null && this.userForm.value.u_name != 'null')
    {
      this.loggedInUser.name = this.userForm.value.u_name + ' ' + this.userForm.value.u_lastname;
    }
    
    this.loggedInUser.email = this.userForm.value.u_email;
    this.loggedInUser.profile_img = profileImage;
    

    this.myStorage.setParameters(this.loggedInUser);

    this.events.publish('loggedIn');
  }

  presentToast(text)
  {
    const toast = this.toastCtrl.create({

      message: text,
      duration: 3000
    });
    toast.present();
  }

 




}
