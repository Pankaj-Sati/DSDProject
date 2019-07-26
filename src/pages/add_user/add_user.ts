import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, Events } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { LoadingController } from "ionic-angular";
import "rxjs/add/operator/map";
import {MenuController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer'
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

import { MyStorageProvider } from '../../providers/my-storage/my-storage';

import { User } from '../../models/login_user.model';

import { StateListProvider } from '../../providers/state-list/state-list';
import {State} from '../../models/state.model';

declare var cordova: any;

@Component({
  selector: 'page-add_user',
  templateUrl: 'add_user.html'
})

export class AddUserPage 
{
  userForm: FormGroup;
  win: any = window;
  lastImage: string;

  stateList: State[] = [];

  loggedInUser: User;

  isImageChanged: boolean = false;

  constructor(public myStorage:MyStorageProvider,
    public filePath: FilePath, 
    public file: File, 
    public fileTransfer: FileTransfer, 
    public platform: Platform, 
    public camera: Camera, 
    public formBuilder: FormBuilder, 
    public apiValue: ApiValuesProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    private http: Http, 
    public loading: LoadingController, 
    public toastCtrl: ToastController, 
    public storage: Storage, 
    public menuCtrl: MenuController,
    public stateListProvider: StateListProvider,
    public events: Events) 
	{
		this.menuCtrl.enable(true);
      this.menuCtrl.swipeEnable(true);

    this.loggedInUser = this.myStorage.getParameters();

    //------------------Gettting State List from Provider---------//

    this.stateList = this.stateListProvider.stateList;
    if (this.stateList == undefined || this.stateList.length == 0)
    {
      this.events.publish('getStateList'); //This event is subscribed to in the app.component page
    }


      this.userForm = this.formBuilder.group({

        u_profile_img: new FormControl(''),
        u_name: new FormControl('', Validators.compose([Validators.required])),

        u_email: new FormControl('', Validators.compose([Validators.pattern(/^$|^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
        u_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
        u_alt: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
        u_gender: new FormControl('', Validators.compose([Validators.required])),
        u_dob: new FormControl('', Validators.compose([Validators.required])),
        u_country: new FormControl('', Validators.compose([Validators.required])),
        u_state: new FormControl('', Validators.compose([Validators.required])),
        u_city: new FormControl('', Validators.compose([Validators.required])),
        u_pincode: new FormControl('', Validators.compose([Validators.required])),
        u_fax: new FormControl(''),
        u_address1: new FormControl('', Validators.compose([Validators.required])),
        u_address2: new FormControl(''),
        u_user_type: new FormControl('', Validators.compose([Validators.required]))

      });

      this.userForm.controls.u_country.setValue('United States');

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

  takeImage() {

    console.log("In take Image()");

    let source = this.camera.PictureSourceType.PHOTOLIBRARY; //Default source type


    let alert = this.alertCtrl.create({
      title: 'Profile Image',
      message: 'Select profile image from:',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            console.log('From Gallery');
            this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            console.log('From camera');
            this.getImage(this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    });
    alert.present();


  }

  getImage(source) {
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: source
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log("Image get()" + imageData);

      if ((imageData != null || imageData != undefined) && imageData.length > 0) {

        //We need to get the native path of the files present in the gallery on Android
        if (this.platform.is('android') && source === this.camera.PictureSourceType.PHOTOLIBRARY) {

          this.filePath.resolveNativePath(imageData)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

             
              this.userForm.value.u_profile_img = this.win.Ionic.WebView.convertFileSrc(imageData);
              this.isImageChanged = true;
              // this.userForm.value.u_profile_img=this.webView.convertFileSrc(imageData);
            })

            .catch(error => {

              console.log("resolveNativePath() error");
              this.presentToast('Error in getting Image');
              console.log(error);
            });



        }
        else {
          var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
          var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
   
          this.userForm.value.u_profile_img = this.win.Ionic.WebView.convertFileSrc(imageData);
          this.isImageChanged = true;
          

        }
      }
      else {
        this.presentToast('Error in getting Image');
      }




    }, (err) => {
      // Handle error
      this.presentToast('Error in getting Image');
    });
  }

  createFileName() {
    //This function creates a new name for the selected image file by naming it after the current timestamp
    let date = new Date();
    let name = date.getTime() + ".jpg";
    return name;
  }

  copyFileToLocalDir(correctPath, currentName, newFileName) {
    this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, newFileName).then(success => {

      this.lastImage = cordova.file.dataDirectory + newFileName;

    }, error => {

      this.presentToast('Error in storing image file');
    });
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

		let loader = this.loading.create({

          content: "Adding user please wait…",
          duration:15000

		 });

    let loadingSuccessful = false; //To know whether timeout occured
      loader.present().then(() => 
      {
        if (!this.isImageChanged || this.lastImage == undefined || this.lastImage.length == 0)
        {
          var headers = new Headers();
          let options = new RequestOptions({ headers: headers });

          console.log("DOB:" + this.userForm.value.u_dob);
          let body = new FormData();
          body.set("full_name", this.userForm.value.u_name);
          body.set("email", this.userForm.value.u_email);
          body.set("contact", String(this.userForm.value.u_contact).replace(/\D+/g, ''));

          console.log('Contact value Sent=' + String(this.userForm.value.u_contact).replace(/\D+/g, ''));

          body.set("alt", '' + String(this.userForm.value.u_alt).replace(/\D+/g, ''));
          body.set("gender", this.userForm.value.u_gender);
          body.set("date_of_birth", this.userForm.value.u_dob);
          body.set("country", this.userForm.value.u_country);
          body.set("state", this.userForm.value.u_state);
          body.set("city", this.userForm.value.u_city);
          body.set("pincode", this.userForm.value.u_pincode);
          body.set("fax", this.userForm.value.u_fax);

          body.set("address1", this.userForm.value.u_address1);
          body.set("address2", this.userForm.value.u_address2);

          body.set("user_type", this.userForm.value.u_user_type);
          body.set("profile_image", '');
          body.set("session_id", this.loggedInUser.id);


          this.http.post(this.apiValue.baseURL + "/add_user", body, options) //Http request returns an observable
            .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

            {
              loadingSuccessful = true;
              loader.dismiss()

              console.log(serverReply);

              if (serverReply)
              {
                try
                {
                  let response = JSON.parse(serverReply['_body']);

                  this.presentToast(response.message);

                  if ('code' in response && response.code == 200) 
                  {
                    //Successfully created user
                    this.navCtrl.pop();
                  }
                }
                catch (err)
                {
                  this.presentToast('Failed to create user ');
                }
              }
              else
              {
                this.presentToast('Failed to create user ');
              }



            }, error =>
              {
                loadingSuccessful = true;
                loader.dismiss();
                this.presentToast('Failed to add user');


              });
        }

        else
        {
          //Image has been changed, so we will send image with values

          let transfer: FileTransferObject = this.fileTransfer.create();

          let filename = this.lastImage.substr(this.lastImage.lastIndexOf('/') + 1);
          var options =
          {
            fileKey: "profile_image",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: {

              "full_name": this.userForm.value.u_name,
              "email": this.userForm.value.u_email,
              "contact": String(this.userForm.value.u_contact).replace(/\D+/g, ''),
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
               "user_type": this.userForm.value.u_user_type,
              "session_id": this.loggedInUser.id

              
            }
          };

          transfer.upload(this.lastImage, this.apiValue.baseURL + "/add_user", options).then(data =>
          {

            loadingSuccessful = true;
            console.log("Image upload server reply");
            console.log(data);

            if (data)
            {
              try
              {
                let response = JSON.parse(data["response"]);
                if (response.code > 400)
                {
                  //Error returned from server
                  this.presentToast(response.message);
                  loader.dismiss();
                  return;
                }
                else
                {
                  //successful
                  this.presentToast(response.message);
                  loader.dismiss();
                  this.navCtrl.pop();
                  return;
                }
              }
              catch (err)
              {
                this.presentToast("Failed!! Server returned an error");
                loader.dismiss();
              }
              
            }
            else
            {
              this.presentToast("Failed!! Server returned an error");
              loader.dismiss();
            }
          }, err =>
          {
              console.log(err);
              loadingSuccessful = true;
              this.presentToast("Failed!! Server returned an error");
              loader.dismiss();

          }).catch(error =>
          {
            loadingSuccessful = true;
            loader.dismiss();
            this.presentToast("Failed to send data");
          });

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

  presentAlert(text)
  {
    const alert = this.alertCtrl.create({
      message: text,
      title: 'Error!',
      buttons: [{
        text:'ok'
      }]
    });
    alert.present();
  }

  presentToast(text) {
    const toast = this.toastCtrl.create({

      message: text,
      duration: 3000
    });
    toast.present();
  }
}
