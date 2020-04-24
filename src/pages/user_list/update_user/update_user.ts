import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, Platform, Events } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Validators,FormBuilder,FormControl,FormGroup} from "@angular/forms";
import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";
import {FileTransfer,FileTransferObject,FileUploadOptions} from '@ionic-native/file-transfer'
import {FilePath} from '@ionic-native/file-path';
import {File} from '@ionic-native/file';
import { ApiValuesProvider } from '../../../providers/api-values/api-values';
import { Storage } from '@ionic/storage';
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { MyStorageProvider } from '../../../providers/my-storage/my-storage';
import { User } from '../../../models/login_user.model';

import { StateListProvider } from '../../../providers/state-list/state-list';
import { State } from '../../../models/state.model';
import { UserType } from '../../../models/user_type.model';
import { UserTypesProvider } from '../../../providers/user-types/user-types';

import {BrContactMaskPipe } from '../../../pipes/br-contact-mask/br-contact-mask';
import { Crop } from '@ionic-native/crop';

declare var cordova:any;

@Component({
  selector: 'update_user',
  templateUrl: 'update_user.html'
})
export class UpdateUserPage
{

	base64Image:string;

  userTypeList: UserType[] = [];

	user:any=null;

  loggedInUser: User;

  passed_uid: string;

  stateList: State[] = [];

	userForm:FormGroup;

	isImageChanged:boolean=false; //To know whether the user changed the image or not

	win:any=window;

	lastImage:string;
	

  constructor(public webView: WebView,
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
    public stateListProvider: StateListProvider,
    public events: Events,
    public userTypesProvider: UserTypesProvider,
    public contactMask: BrContactMaskPipe,
    public crop: Crop) 
  {

    this.loggedInUser = this.myStorage.getParameters();

    //------------------Gettting State List from Provider---------//

    this.stateList = this.stateListProvider.stateList;
    if (this.stateList == undefined || this.stateList.length == 0)
    {
      this.events.publish('getStateList'); //This event is subscribed to in the app.component page
    }

    //---------------------Getting User type List-------------------//
    this.userTypeList = this.userTypesProvider.userTypeList;
    if (this.userTypeList == undefined || this.userTypeList.length == 0)
    {
      this.events.publish('getUserTypeList'); //This event is subscribed to in the app.component page
    }

    this.userForm=this.formBuilder.group({

			u_profile_img:new FormControl(''),

      u_name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      u_lastname: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
			
      u_email: new FormControl('', Validators.compose([Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
      u_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
      u_alt: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
			u_gender: new FormControl(''),
			u_dob:new FormControl(''),
			u_country: new FormControl('',Validators.compose([Validators.required])),
			u_state:new FormControl(''),
      u_city: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.INPUT_VALIDATOR)])),
      u_pincode: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ZIPCODE_VALIDATOR)])),
			u_fax:new FormControl(''),
      u_address1: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
      u_address2: new FormControl('', Validators.compose([Validators.pattern(this.apiValue.ADDRESS_VALIDATOR)])),
			u_user_type:new FormControl('',Validators.compose([Validators.required]))
			
    }); 

    this.userForm.controls.u_country.setValue('United States');
    this.userForm.controls.u_country.updateValueAndValidity();

	}

	ionViewDidLoad()
    {
    		//This method is called when the page loads for the first time
    		this.passed_uid=this.navParams.get('id'); //Get the id field passed from the user_list page
    		console.log("Id received="+this.passed_uid);
    		this.fetchData();
    }

  takeImage()
    {

    	console.log("In take Image()");

    	let source=this.camera.PictureSourceType.PHOTOLIBRARY; //Default source type


		 let alert = this.alertCtrl.create({
		    title: 'Profile Image',
		    message:'Select profile image from:',
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
           },
          {
            text: 'Cancel',
            role:'cancel'
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
          allowEdit: true,
		   sourceType:source
		};

    	this.camera.getPicture(options).then((imageData) => {
		 // imageData is either a base64 encoded string or a file URI
		 // If it's base64 (DATA_URL):
		 console.log("Image get()"+imageData);

		 if((imageData!=null || imageData!=undefined) && imageData.length>0)
		 {

           this.cropImage(imageData, source);
           console.log('Image after cropping');
           console.log(imageData);

		 }
		 else
         {
          
           console.log('imageData Error');
           this.presentToast('Error!!!Please select other image');
		 }

		 
		 

		}, (err) => {
            // Handle error
            console.log(err);
            console.log('getPicture Error');
            this.presentToast('Error!!!Please select other image');
		});
    }

  prepareImage(imageData, source)
  {
    console.log('-------In Prepare Image---------');
    console.log(imageData);
    console.log(source);
    //We need to get the native path of the files present in the gallery on Android
    if (this.platform.is('android') && source === this.camera.PictureSourceType.PHOTOLIBRARY) 
    {

      this.filePath.resolveNativePath(imageData)
        .then(filePath => 
        {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

         
          // this.userForm.value.u_profile_img=this.webView.convertFileSrc(imageData);
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

    }
  }

	createFileName()
	{
		//This function creates a new name for the selected image file by naming it after the current timestamp
		let date=new Date();
		let name=date.getTime()+".jpg";
		return name;
	}

	copyFileToLocalDir(correctPath,currentName,newFileName)
    {

      console.log('In copyFileToLocalDir');
      console.log(correctPath);
      console.log(currentName);

		this.file.copyFile(correctPath,currentName,cordova.file.dataDirectory,newFileName).then(success=>{

          this.lastImage = cordova.file.dataDirectory + newFileName;
          this.userForm.controls.u_profile_img.setValue(this.win.Ionic.WebView.convertFileSrc(this.lastImage));
          this.userForm.controls.u_profile_img.updateValueAndValidity();
          this.isImageChanged = true; //We have got our image successfully;

        }, error =>
          {
            console.log(error);
            
            console.log('copyFileToLocalDir Error');
            this.presentToast('Error!!!Please select other image');
		});
	}

  isValid(email) 
    {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
	}

	fetchData()
	{
		
	   this.user=null;

	   if(this.passed_uid==null)
	   {
	   		const toast = this.toastCtrl.create({
							  message: 'No user Id received',
							  duration: 3000
							});
							toast.present();
			this.navCtrl.pop(); //pop this page from stack
	   }

	   else
	   {
	   		var headers = new Headers();

		       let options = new RequestOptions({ headers: headers });
			   let data = 
		         { //Data to be sent to the server

		         };

				let loader = this.loading.create({

                  content: "Loading ...",
                  duration:20000

				 });

			   loader.present().then(() => 
				{

			   this.http.post(this.apiValue.baseURL+"/user_view/"+this.passed_uid,data,options) //Http request returns an observable

			   .map(response => response.json()) ////To make it easy to read from observable

			   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
						  
					{ 
				   			console.log(serverReply);
				   			loader.dismiss();

				   			if('message' in serverReply) //incorrect
							{
							
								const toast = this.toastCtrl.create({
									  message: serverReply.message,
									  duration: 5000
									});
									toast.present();
							}
							else
							{
								this.user=serverReply[0];
								
								this.userForm.controls.u_name.setValue(this.user.name);
								this.userForm.controls.u_lastname.setValue(this.user.lastname);
                                      this.userForm.controls.u_email.setValue(this.user.email);

                                      //----Masking Contact----//

                                      this.userForm.controls.u_contact.setValue(this.contactMask.transform(this.user.contact));
                                      this.userForm.controls.u_alt.setValue(this.contactMask.transform(this.user.alternate_number));

                this.userForm.controls.u_gender.setValue(this.user.gender.toLowerCase());
                this.userForm.controls.u_dob.setValue('');
                if (this.user.dob != undefined && this.user.dob != null)
                {
                  var date = this.user.dob.split(" ");
                  this.userForm.controls.u_dob.setValue(date[0]);
                }
							
							
                this.userForm.controls.u_address1.setValue(this.user.permanent_addressLine1);
                this.userForm.controls.u_address2.setValue(this.user.permanent_addressLine2);

								this.userForm.controls.u_city.setValue(this.user.city);
								this.userForm.controls.u_state.setValue(this.user.state);
								this.userForm.controls.u_pincode.setValue(this.user.zipCode);
					     // this.userForm.controls.u_country.setValue(this.user.country); //In template the country name is coded in select option
								
								this.userForm.controls.u_fax.setValue(this.user.fax);
								this.userForm.controls.u_user_type.setValue(this.user.usertype_id);
								if(this.user.profile_img!=null && this.user.profile_img!=undefined && this.user.profile_img.length>0)
								{
									this.userForm.controls.u_profile_img.setValue(this.apiValue.baseImageFolder+this.user.profile_img);
								
                }
                this.userForm.updateValueAndValidity();

								
							}

					   });

		  		 });
				
	   }
	   

    }

  submitData()
    {

    console.log("Image changed" + this.isImageChanged);
    console.log("Country Value" + this.userForm.controls.u_country.value);

	    	if(! this.isImageChanged || this.lastImage==undefined || this.lastImage.length==0)
	    	{
	    		//If image is not changed, we don't need to send data using file transfer
	    	
	    		var headers = new Headers();
				let options = new RequestOptions({ headers: headers });

				let body = new FormData();
              body.set("uid",this.passed_uid);
              body.set("first_name",this.userForm.value.u_name);
              body.set("last_name",this.userForm.value.u_lastname);
              body.set("email",this.userForm.value.u_email);
              body.set("contact", String(this.userForm.value.u_contact).replace(/\D+/g, ''));
              body.set("alt",String(this.userForm.value.u_alt).replace(/\D+/g,''));
              body.set("gender",this.userForm.value.u_gender);
              body.set("date_of_birth",this.userForm.value.u_dob);
              body.set("country",this.userForm.value.u_country);
              body.set("state",this.userForm.value.u_state);
              body.set("city",this.userForm.value.u_city);
              body.set("pincode",this.userForm.value.u_pincode);
              body.set("fax",this.userForm.value.u_fax);
              body.set("address1", this.userForm.value.u_address1);
              body.set("address2", this.userForm.value.u_address2);
              body.set("user_type", this.userForm.value.u_user_type);
              body.set("session_id", this.loggedInUser.id);

				if(this.userForm.value.u_profile_img!=null && this.userForm.value.u_profile_img.length>0)
        {
                  //Setting the value to the previous one. If this is not done, API may change a previous profile image to null.
            body.set("profile_image", this.userForm.value.u_profile_img);
				}
			

				let loader = this.loading.create({

			   content: "Updating user please wait…",
			   duration:25000

			 });
				console.log("Body");
				console.log(body);

				let loadingSuccessful=false; //To knopw whether timeout occured
              console.log("Full name");
              console.log(this.userForm.value.u_name + ' ' + this.userForm.value.u_lastname);
			
			loader.present().then(() => 
			{

		   this.http.post(this.apiValue.baseURL+"/update_user",body,options) //Http request returns an observable
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
                   //Successfully updated the user
                   this.navCtrl.getPrevious().data.reload = true;
                   this.navCtrl.pop();
                 }
               }
               catch (err)
               {
                 this.presentToast('Failed!!! Server returned an error');
               }
             }
             else
             {
               this.presentToast('Failed!!! Server returned an error');
             }
			

	  		 },error=>{
	  		 	loadingSuccessful=true;
			   		loader.dismiss();
			   		this.presentToast('Failed to update user');
	  		 });
		   });

			loader.onDidDismiss(()=>{

				if(! loadingSuccessful)
				{
					this.presentToast('Timeout!!! Server did not respond');
				}
			});

		}
		else
		{
			//Image has been changed. Therefore we will need file transfer plugin
			let transfer:FileTransferObject=this.fileTransfer.create();

			let filename=this.lastImage.substr(this.lastImage.lastIndexOf('/')+1);
			var options = 
			{
				fileKey: "profile_image",
				fileName: filename,
				chunkedMode: false,
				mimeType: "multipart/form-data",
				params : {

					"uid":this.passed_uid,
					"first_name":this.userForm.value.u_name,
					"last_name":this.userForm.value.u_lastname,
					"email":this.userForm.value.u_email,
           "contact": String(this.userForm.value.u_contact).replace(/\D+/g, ''),
            "alt": String(this.userForm.value.u_alt).replace(/\D+/g, ''),
					"gender":this.userForm.value.u_gender,
					"date_of_birth":this.userForm.value.u_dob,
					"country":this.userForm.value.u_country,
					"state":this.userForm.value.u_state,
					"city":this.userForm.value.u_city,
					"pincode":this.userForm.value.u_pincode,
					"fax":this.userForm.value.u_fax,
          "address1": this.userForm.value.u_address1,
          "address2": this.userForm.value.u_address2,
          "user_type": this.userForm.value.u_user_type,
          "session_id": this.loggedInUser.id    
				}
			};

			let loader=this.loading.create({

				content:"Updating data...",
				duration:60000
			});

			let transferSuccessful=false; //To know whether timeout occured or not

			loader.present();

			transfer.upload(this.lastImage,this.apiValue.baseURL+"/update_user",options).then(data=>{

				transferSuccessful=true;
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
                this.presentToast("Failed!! Server returned an error");
                loader.dismiss();
              }

            }
            else
            {
              this.presentToast("Failed!! Server returned an error");
              loader.dismiss();
            }

			},err=>{

				console.log(err);
				transferSuccessful=true;
				this.presentToast("Failed!! Server returned an error");
				loader.dismiss();

			})
			.catch(err=>{

				transferSuccessful=true;
				console.log(err);
				this.presentToast("Failed!! Server returned an error");
				loader.dismiss();

			});

			loader.onDidDismiss((data)=>{

				console.log(data);
				if(! transferSuccessful)
				{
					this.presentToast("Failure!! Check your internet connection");
				}
			});
		}
	

    }
    
  presentToast(text)
    {
    	const toast=this.toastCtrl.create({

    		message:text,
    		duration:3000
    	});
    	toast.present();
    }

  async cropImage(imageData, source)
  {
    //To crop the selected image
    console.log('In crop Image');

    if (source == this.camera.PictureSourceType.CAMERA)
    {
      //If source type is camera, we don't need to crop the image
      this.prepareImage(imageData, source);
      return;
    }
    await this.crop.crop(imageData).then(newPath =>
    {
      console.log('New Cropped Path=' + newPath);
      this.prepareImage(newPath, source);
     
    },
      error =>
      {
        console.log(error);
        this.presentToast('Error in cropping image');
        this.prepareImage(imageData, source);
      });

    console.log('Crop Image Ends');
  }
	

}
