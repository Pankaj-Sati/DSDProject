import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController,Platform } from 'ionic-angular';
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

declare var cordova:any;

@Component({
  selector: 'update_user',
  templateUrl: 'update_user.html'
})
export class UpdateUserPage
{

	base64Image:string;

	user:any=null;

  loggedInUserId;

	passed_uid:string;

	userForm:FormGroup;

	isImageChanged:boolean=false; //To know whether the user changed the image or not

	win:any=window;

	lastImage:string;
	

	constructor(public webView:WebView,public storage:Storage,public file:File,public platform:Platform,public filePath:FilePath,public fileTransfer:FileTransfer,public formBuilder:FormBuilder,public apiValue:ApiValuesProvider,private camera: Camera,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController, public menuCtrl: MenuController) 
	{
			this.userForm=this.formBuilder.group({

			u_profile_img:new FormControl(''),
			u_name:new FormControl('',Validators.compose([Validators.required])),
			
              u_email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])),
              u_contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
              u_alt: new FormControl('', Validators.compose([Validators.pattern(/^\(([0-9]{3})\)[-]([0-9]{3})[-]([0-9]{4})$/)])),
			u_gender: new FormControl('',Validators.compose([Validators.required])),
			u_dob:new FormControl('',Validators.compose([Validators.required])),
			u_country: new FormControl('',Validators.compose([Validators.required])),
			u_state:new FormControl('',Validators.compose([Validators.required])),
			u_city: new FormControl('',Validators.compose([Validators.required])),
			u_pincode:new FormControl('',Validators.compose([Validators.required])),
			u_fax:new FormControl(''),
			u_street:new FormControl('',Validators.compose([Validators.required])),
			u_user_type:new FormControl('',Validators.compose([Validators.required]))
			
            });

      this.storage.get("id").then((value) => {

        this.loggedInUserId = value;
        console.log("Logged In User ID:" + value);
      });
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
		   sourceType:source
		};

    	this.camera.getPicture(options).then((imageData) => {
		 // imageData is either a base64 encoded string or a file URI
		 // If it's base64 (DATA_URL):
		 console.log("Image get()"+imageData);

		 if((imageData!=null || imageData!=undefined) && imageData.length>0)
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

		          this.isImageChanged=true; //We have got our image successfully;
		         this.userForm.value.u_profile_img=this.win.Ionic.WebView.convertFileSrc(imageData);
		         // this.userForm.value.u_profile_img=this.webView.convertFileSrc(imageData);
		        })

		        .catch(error=>{

		        	console.log("resolveNativePath() error");
		        	this.presentToast('Error in getting Image');
		        	console.log(error);
		        });
		        

		  
		    } 
		    else 
		    {
		      var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
		      var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
		      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
		      this.isImageChanged=true; //We have got our image successfully;
		      // this.userForm.value.u_profile_img=this.win.Ionic.WebView.convertFileSrc(imageData);
                this.userForm.value.u_profile_img = this.webView.convertFileSrc(imageData);
               
		    }
		 }
		 else
		 {
		 	this.presentToast('Error in getting Image');
		 }

		 
		 

		}, (err) => {
		 // Handle error
			 this.presentToast('Error in getting Image');
		});
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
		this.file.copyFile(correctPath,currentName,cordova.file.dataDirectory,newFileName).then(success=>{

			this.lastImage=cordova.file.dataDirectory+newFileName;

		}, error=>{

			this.presentToast('Error in storing image file');
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
								this.userForm.controls.u_email.setValue(this.user.email);
								this.userForm.controls.u_contact.setValue(this.user.contact);
								this.userForm.controls.u_alt.setValue(this.user.alternate_number);

								this.userForm.controls.u_gender.setValue(this.user.gender.toLowerCase());
								var date=this.user.dob.split(" ");
								this.userForm.controls.u_dob.setValue(date[0]);
								this.userForm.controls.u_street.setValue(this.user.streetNoName);
								this.userForm.controls.u_city.setValue(this.user.city);
								this.userForm.controls.u_state.setValue(this.user.state);
								this.userForm.controls.u_pincode.setValue(this.user.zipCode);
					
								if(this.user.country!=null && this.user.country.toLowerCase()=='united states')
								{
									this.userForm.controls.u_country.setValue("321"); //In template the country name is coded in select option
								}
								this.userForm.controls.u_fax.setValue(this.user.fax);
								this.userForm.controls.u_user_type.setValue(this.user.usertype_id);
								if(this.user.profile_img!=null && this.user.profile_img!=undefined && this.user.profile_img.length>0)
								{
									this.userForm.controls.u_profile_img.setValue(this.apiValue.baseImageFolder+this.user.profile_img);
								
								}

								
							}

					   });

		  		 });
				
	   }
	   

    }

    submitData()
    {

      console.log("Image changed" + this.isImageChanged);

	    	if(! this.isImageChanged || this.lastImage==undefined || this.lastImage.length==0)
	    	{
	    		//If image is not changed, we don't need to send data using file transfer
	    	
	    		var headers = new Headers();
				let options = new RequestOptions({ headers: headers });

				let body = new FormData();
				body.append("uid",this.passed_uid);
				body.append("full_name",this.userForm.value.u_name);
				body.append("email",this.userForm.value.u_email);
        body.append("contact", String(this.userForm.value.u_contact).replace(/\D+/g, ''));
				body.append("alt",String(this.userForm.value.u_alt).replace(/\D+/g,''));
				body.append("gender",this.userForm.value.u_gender);
				body.append("date_of_birth",this.userForm.value.u_dob);
				body.append("country",this.userForm.value.u_country);
				body.append("state",this.userForm.value.u_state);
				body.append("city",this.userForm.value.u_city);
				body.append("pincode",this.userForm.value.u_pincode);
				body.append("fax",this.userForm.value.u_fax);
				body.append("street",this.userForm.value.u_street);
		        body.append("user_type", this.userForm.value.u_user_type);
		        body.append("session_id", this.loggedInUserId);

				if(this.userForm.value.u_profile_img!=null && this.userForm.value.u_profile_img.length>0)
				{
					 this.base64Image =this.userForm.value.u_profile_img;
					 body.append(" profile_image",this.base64Image);
				}
			

				let loader = this.loading.create({

			   content: "Updating user please wait…",
			   duration:15000

			 });
				console.log("Body");
				console.log(body);

				let loadingSuccessful=false; //To knopw whether timeout occured
				console.log("Full name");
				console.log(this.userForm.value.u_name);
			
			loader.present().then(() => 
			{

		   this.http.post(this.apiValue.baseURL+"/update_user",body,options) //Http request returns an observable

		   .map(response => response.json()) ////To make it easy to read from observable

		   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
					  
				{ 
			   		console.log(serverReply);
			   		loadingSuccessful=true;
			   		loader.dismiss();
					
			   		this.presentToast(serverReply.message);
			

	  		 },error=>{
	  		 	loadingSuccessful=true;
			   		loader.dismiss();
			   		this.presentToast('Failed to upadte user');
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
					"full_name":this.userForm.value.u_name,
					"email":this.userForm.value.u_email,
					"contact":this.userForm.value.u_contact,
					"alt":this.userForm.value.u_alt,
					"gender":this.userForm.value.u_gender,
					"date_of_birth":this.userForm.value.u_dob,
					"country":this.userForm.value.u_country,
					"state":this.userForm.value.u_state,
					"city":this.userForm.value.u_city,
					"pincode":this.userForm.value.u_pincode,
					"fax":this.userForm.value.u_fax,
					"street":this.userForm.value.u_street,
          "user_type": this.userForm.value.u_user_type,
          "session_id": this.loggedInUserId
				}
			};

			let loader=this.loading.create({

				content:"Updating data...",
				duration:25000
			});

			let transferSuccessful=false; //To know whether timeout occured or not

			loader.present();

			transfer.upload(this.lastImage,this.apiValue.baseURL+"/update_user",options).then(data=>{

				transferSuccessful=true;
				console.log("Image upload server reply");
				console.log(data);

				if(data)
				{
					if(JSON.parse(data["_body"])['code']>400)
					{
						//Error returned from server
						this.presentToast(JSON.parse(data["_body"])['message']);
						loader.dismiss();
						return;
					}
					else
					{
						//successful
						this.presentToast(JSON.parse(data["_body"])['message']);
						loader.dismiss();
						return;
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


	

}
