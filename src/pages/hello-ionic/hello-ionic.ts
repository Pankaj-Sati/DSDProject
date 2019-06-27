import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";
import { File } from '@ionic-native/file';

declare var cordova: any;

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage 
{

	imagePath:string;
	lastImage:string;


 	constructor(public file: File,public transfer: FileTransfer,private camera: Camera,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private http: Http,  public loading: LoadingController,public toastCtrl: ToastController, public menuCtrl: MenuController) 
	{

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

		 if(imageData!=null && imageData.length>0)
		 {
		 	this.imagePath=imageData;
		 	var currentName = this.imagePath.substr(this.imagePath.lastIndexOf('/') + 1);
	      var correctPath = this.imagePath.substr(0, this.imagePath.lastIndexOf('/') + 1);
	      console.log("correctPath"+correctPath);
	      console.log("CreateFileName"+this.createFileName());
	      console.log("cordova.file.dataDirectory="+cordova.file.dataDirectory);
	      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
		  this.uploadImage(imageData);
		  this.uploadImage1(imageData);
		 }
		 else
		 {
		 	const toast=this.toastCtrl.create({
		 		message:'Failure in getting image',
		 		duration:3000
		 	});

		 	toast.present();
		 }
		 

		}, (err) => {
		 // Handle error
		});
	}

	uploadImage(imageData)
	{
		console.log("In transfer function");
		console.log(this.transfer);
		const fileTransfer: FileTransferObject = this.transfer.create();
		console.log("Transfer Object created");

		var targetPath = this.pathForImage(this.lastImage);
		let fileName=this.lastImage;

		    let options1: FileUploadOptions = {
		       fileKey: 'file',
		       fileName: fileName,
		        mimeType: 'image/jpeg',
      			params: { 'id': 156, 'fileName':fileName },
		       headers: {},
		       
		    
		    };
		    console.log("Options created");

		fileTransfer.upload(targetPath, 'http://192.168.1.7/php/upload_script.php', options1)
		 .then((data) => {
		   // success
		  console.log("Success in Transfer");
		  console.log(data);

		 }, (err) => {
		   // error
		 console.log("Error in Upload");
		  console.log(err);
		 });
		 console.log("Transfer function ended");

	}

	uploadImage1(imageData)
		{
			console.log("In transfer function");
			console.log(this.transfer);
			const fileTransfer: FileTransferObject = this.transfer.create();
			console.log("Transfer Object created");

			var targetPath = this.pathForImage(this.lastImage);
			let fileName=this.lastImage;

			    let options1: FileUploadOptions = {
			       fileKey: 'file',
			       fileName: fileName,
			        
	      			params: { 'id': 156, 'fileName':fileName },
			       headers: {'head':'Hi HEad'},
			       
			    
			    };
			    console.log("Options created");

			fileTransfer.upload(targetPath, 'http://192.168.1.7/php/upload_script.php', options1)
			 .then((data) => {
			   // success
			  console.log("Success in Transfer");
			  console.log(data);

			 }, (err) => {
			   // error
			 console.log("Error in Upload");
			  console.log(err);
			 });
			 console.log("Transfer function ended");

		}


		// Create a new name for the image
		private createFileName() {
		  var d = new Date();
		  let n = d.getTime();
		  let newFileName =  n + ".jpg";
		  return newFileName;
		}
		 
		// Copy the image to a local folder
		private copyFileToLocalDir(namePath, currentName, newFileName) {

			console.log("In copy NamePath:"+namePath+" currentName:"+currentName+" newFileName:"+newFileName);
		  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
		    this.lastImage = newFileName;
		  }, error => {
		    this.presentToast('Error while storing file.');
		  });
		}
		 
		private presentToast(text) {
		  let toast = this.toastCtrl.create({
		    message: text,
		    duration: 3000,
		    position: 'top'
		  });
		  toast.present();
		}
		 
		// Always get the accurate path to your apps folder
		public pathForImage(img) {
		  if (img === null) {
		    return '';
		  } else {
		    return cordova.file.dataDirectory + img;
		  }
		}


}



