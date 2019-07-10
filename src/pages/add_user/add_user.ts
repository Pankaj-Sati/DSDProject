import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
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

import {MyStorageProvider} from '../../providers/my-storage/my-storage';
import {User} from '../../models/login_user.model';

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

  loggedInUser:User;

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
    public menuCtrl: MenuController) 
	{
		this.menuCtrl.enable(true);
      this.menuCtrl.swipeEnable(true);

      this.loggedInUser=this.myStorage.getParameters();

      this.userForm = this.formBuilder.group({

        u_profile_img: new FormControl(''),
        u_name: new FormControl('', Validators.compose([Validators.required])),

        u_email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
        u_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
        u_alt: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
        u_gender: new FormControl('', Validators.compose([Validators.required])),
        u_dob: new FormControl('', Validators.compose([Validators.required])),
        u_country: new FormControl('', Validators.compose([Validators.required])),
        u_state: new FormControl('', Validators.compose([Validators.required])),
        u_city: new FormControl('', Validators.compose([Validators.required])),
        u_pincode: new FormControl('', Validators.compose([Validators.required])),
        u_fax: new FormControl(''),
        u_street: new FormControl('', Validators.compose([Validators.required])),
        u_user_type: new FormControl('', Validators.compose([Validators.required]))

      });

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
   
          this.userForm.value.u_profile_img=this.win.Ionic.WebView.convertFileSrc(imageData);
          

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
      body.append("contact", this.userForm.value.u_contact);
      body.append("alt", this.userForm.value.u_alt);
      body.append("gender", this.userForm.value.u_gender);
      body.append("date_of_birth", this.userForm.value.u_dob);
      body.append("country", this.userForm.value.u_country);
      body.append("state", this.userForm.value.u_state);
      body.append("city", this.userForm.value.u_city);
      body.append("pincode", this.userForm.value.u_pincode);
      body.append("fax", this.userForm.value.u_fax);
      body.append("street", this.userForm.value.u_street);
      body.append("user_type", this.userForm.value.u_user_type);
      body.append("profile_image",'');
      body.append("session_id",this.loggedInUser.id);

		
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

		 });
		
		loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/add_user",body,options) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
			{ 
		   		
		   		loader.dismiss()
				
				console.log(serverReply);
		   	
		   		const toast = this.toastCtrl.create({
							  message: serverReply.message,
							  duration: 3000
							});
							toast.present();
			 
		   		if('code' in serverReply && serverReply.code==200) 
					{
						//Successfully created user
						this.navCtrl.setRoot(DashboardPage);
					}
			   });

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
