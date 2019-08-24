import { Component } from '@angular/core';
import { Events, NavParams, Platform } from 'ionic-angular';
import { LoadingController, ToastController, NavController, NavOptions, AlertController, ModalController } from 'ionic-angular';
import { Http } from "@angular/http";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer'
import { FilePath } from '@ionic-native/file-path';
import { File, Entry } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Chooser } from '@ionic-native/chooser';

import {DownloadDocumentsComponent } from '../../../../components/download-documents/download-documents';
import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { ClientDocuments } from '../../../../models/client_document.model';
import { ClientDetails } from '../../../../models/client.model';
import { User } from '../../../../models/login_user.model';

declare var cordova: any;

@Component({
  selector: 'document',
  templateUrl: 'document.html'
})

export class ClientDocumentsPage
{
  doc_list: ClientDocuments[] = [];

  selectedDocList: ClientDocuments[] = [];
 
  passed_client_id;
  passed_advocate_id;
  passed_client_name;
  selected_file_name: string; //If user wanted to add a new file to upload
  lastImage; //Last selected Image
  loggedInUser: User;

  uploadProgress: any = 0;

  isUploading: boolean = false; //To indicate whether currently any file is being uploaded

  blurAmount: string = ''; //To set blurr background class when modal opens

  loadingTimeout = 30 * 1000; //Default 30 seconds timeout for file upload
 
  constructor
    (
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public http: Http,
      public alertCtrl: AlertController,
      public apiValues: ApiValuesProvider,
      public navCtrl: NavController,
      public navParams: NavParams,
      public inAppBrowser: InAppBrowser,
      public file: File,
      public platform: Platform,
      public filePath: FilePath,
      public modalCtrl: ModalController,
      public fileTransfer: FileTransfer,
      private camera: Camera,
      public myStorage: MyStorageProvider,
      public fileChooser: Chooser

    )
  {
    this.loggedInUser = this.myStorage.getParameters();
   
  }

  ionViewDidLoad()
  {
    console.log('Client Documents: ionViewDidLoad');

    this.passed_client_id = this.navParams.get('client_id');
    this.passed_advocate_id = this.navParams.get('advocate_id');
    this.passed_client_name = this.navParams.get('client_name');


    console.log('Client Id Received:' + this.passed_client_id);

    console.log('Advocate Received:' + this.passed_advocate_id);
    this.fetchData();
  }


  getDocument(document: ClientDocuments)
  {
    //To download a single document

    if (document.documents == null || document.documents.length == 0)
    {
      return;
    }

    let data = {
      document: document.directory_id +'/'+document.documents
    };
    const modal = this.modalCtrl.create(DownloadDocumentsComponent, data);
    this.blurAmount = 'blurDiv';
    modal.present();

    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
    });
  }

  downloadMultipleDoc()
  {
    if (this.doc_list.length == 0)
    {
      return;
    }


    if (this.selectedDocList.length == 0)
    {
      //download all
      var data =
      {
        document: this.makeDocString(this.doc_list),
        documentData: this.doc_list
      };
    }

    else
    {
      //Download selected
      var data =
      {
        document: this.makeDocString(this.selectedDocList),
        documentData: this.selectedDocList
      };
    }

    const modal = this.modalCtrl.create(DownloadDocumentsComponent, data);
    this.blurAmount = 'blurDiv';
    modal.present();

    modal.onDidDismiss(() =>
    {
      this.blurAmount = '';
    });
  }

  makeDocString(docArray: ClientDocuments[]): string
  {
    //To make a comma seperated string out of the documents to be downloaded
    let str:string = '';
    for (let i = 0; i < docArray.length; i++)
    {
      if (i == docArray.length - 1)
      {
        str = str + docArray[i].directory_id + '/' + docArray[i].documents;
      }
      else
      {
        str = str + docArray[i].directory_id + '/' +docArray[i].documents + ',';
      }
    }
    return str;
  }

  documentSelected(doc: ClientDocuments)
  {
    console.log('---In Document Selected---');
   
    let index = this.selectedDocList.findIndex(document => document.id == doc.id);
    if (index>=0)
    {
      //Found. Therefore delete
      this.selectedDocList.splice(index, 1);
    }
    else
    {
      //Not Found. Therefore add
      this.selectedDocList.push(doc);
    }
    
    console.log(this.selectedDocList);
    
  }

  isDocumentSelected(doc: ClientDocuments)
  {
    let result: ClientDocuments = this.selectedDocList.find(document => document.id == doc.id);
    
    if (result == null || result == undefined || result.id.length==0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  fetchData()
  {

    this.doc_list = [];

    const loader = this.loadingCtrl.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.append('cid', this.passed_client_id);

      this.http.post(this.apiValues.baseURL + "/client_doc_view.php", body, null)
        .subscribe(response =>
        {
          loadingSuccessful = true;
          loader.dismiss();
          if (response)
          {
            console.log(response);

            try
            {
              let data = JSON.parse(response['_body']);

              if ('code' in data)
              {
                this.showToast(data.message);
                return;
              }
              else
              {
                this.doc_list = data;
                
              }
            }
            catch (err)
            {
              console.log(err);
              this.showToast('Failure!!! Error in response');
            }

          }
          else
          {
            this.showToast('Failure!!! Error in response');
          }
        },
          error =>
          {
            loadingSuccessful = true;
            this.showToast('Failed to get data from server');
            loader.dismiss();
          });

    });

    loader.onDidDismiss(() =>
    {

      if (!loadingSuccessful)
      {
        this.showToast('Error!!! Server did not respond');
      }

    });

  }

  showToast(text)
  {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });

    toast.present();
  }

  addDocument()
  {

  }

  showFileSelectionDialog()
  {

    console.log("In take Image()");

    let source = this.camera.PictureSourceType.PHOTOLIBRARY; //Default source type


    let alert = this.alertCtrl.create({
      title: 'Upload New Document',
      message: 'Select document from:',
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
          text: 'Files',
          handler: () =>
          {
            console.log('From files');
            this.takeFile();
          }
        },
        {
          text: 'Cancel',
          handler: () =>
          {
            console.log('Canceled');
            
          }
        }
      ]
    });
    alert.present();


  }

  takeFile()
  {
    console.log('In Take File()');
    this.fileChooser.getFile('')
      .then(file =>
      {
        if (file)
        {
          console.log('File selected');
          console.log('File Name=' + file.name);
         // console.log('Data URI=' + file.dataURI);
         // console.log('Data=' + file.data);
          console.log('Media Type=' + file.mediaType);
          console.log('URI=' + file.uri);
        

          this.lastImage = file.uri;
          this.selected_file_name = file.name;
          this.presentToast('Uploading...');
          this.uploadFile();
         
        }
        else
        {
          console.log('File Chooser Cancelled');
        }
        
      })
      .catch((error: any) => console.error(error));
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
              
              
            })

            .catch(error =>
            {

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
          

        }
      }
      else
      {
        this.presentToast('Error in getting Image');
      }

    }, (err) =>
      {
        // Handle error
        this.presentToast('Error in getting Image');
      });
  }

  createFileName()
  {
    //This function creates a new name for the selected image file by naming it after the current timestamp
    let date = new Date();
    let name = date.getTime() + ".jpg";
    return name;
  }

  async copyFileToLocalDir(correctPath, currentName, newFileName)
  {
    await this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, newFileName).then(success =>
    {

      this.lastImage = cordova.file.dataDirectory + newFileName;
      this.selected_file_name = currentName;
      this.uploadFile();

    }, error =>
      {

        this.presentToast('Error in storing image file');
      });
  }

  async uploadFile()
  {

    this.loadingTimeout = 30 * 1000; //Default;

    let fileInfo: Entry = undefined;
    await this.file.resolveLocalFilesystemUrl(this.lastImage).then(file =>
    {
      console.log(file);
      fileInfo = file;
     
     
    });

    //Calculate Timeout
    if (fileInfo != undefined)
    {
      await fileInfo.getMetadata(metadata =>
      {
        const timeoutFor1MB = 25 * 1000; //Timeout for 1 MB;

        console.log(metadata);
        if (metadata != undefined)
        {
          if (metadata.size <= (1024 * 1024)) //Less than 1MB
          {
            this.loadingTimeout = 25 * 1000;
          }
          else
          {
            let sizeInMB = metadata.size / (1024 * 1024); //Metadata size will return size in bytes. We will convert this into MB
            this.loadingTimeout = sizeInMB * timeoutFor1MB; //5MB * 20 seconds 
          }

        }

      });
    }
    

    console.log('Loading Timeout='+this.loadingTimeout);

    let transfer: FileTransferObject = this.fileTransfer.create();
    this.uploadProgress = 0;
    this.isUploading = true;
    let filename = this.selected_file_name;
    console.log('File Name='+filename);
      var options =
      {
        fileKey: "doc",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: {

          "cid": this.passed_client_id,
          "folder_id": this.passed_client_id, //On server, a folder is created with the name=Client ID to store all doucments of that client in it 
          "advocate_id": this.passed_advocate_id,
          "client_name": this.passed_client_name,
          "session_id": this.loggedInUser.id

        }
      };

    let loaderContent = '<ion-row">'+
      '<ion-col style="text-align:center" >"Uploading...</ion-col>'+
        '</ion-row>';

    let loader = this.loadingCtrl.create({

      content: loaderContent,
      duration: this.loadingTimeout
      });

      let transferSuccessful = false; //To know whether timeout occured or not

      //loader.present();
    
    //this.apiValues.baseURL + '/client_doc_upload.php'
    transfer.upload(this.lastImage, this.apiValues.baseURL + '/client_doc_upload.php', options).then(data =>
      {

      transferSuccessful = true;
      this.isUploading = false;
        console.log("Image upload server reply");
        console.log(data);
        //loader.dismiss(); 
        if (data)
        {
          try
          {
            let response = JSON.parse(data["response"]);
            if (response.code > 400)
            {
              //Error returned from server
              this.presentToast(response.message);
             
              return;
            }
            else
            {
              //Success
              this.presentToast(response.message);
              this.selected_file_name = ''; //To hide the upload button and content
              this.fetchData();
             
              return;
            }
          }
          catch (err)
          {
            console.log(err);
            this.presentToast('Error in response');
           
            return;
          }
          
        }
        else
        {
          this.presentToast("Failed!! Server returned an error");
         
        }

      }, err =>
        {
        this.isUploading = false;
          console.log(err);
          transferSuccessful = true;
          this.presentToast("Failed!! Server returned an error");
          //loader.dismiss();

        })
        .catch(err =>
        {
          this.isUploading = false;
          transferSuccessful = true;
          console.log(err);
          this.presentToast("Failed!! Server returned an error");
         // loader.dismiss();

        });

    transfer.onProgress((progress) =>
    {
      this.onFileProgressChange(progress);
     
    });

      loader.onDidDismiss((data) =>
      {

        console.log(data);
        if (!transferSuccessful)
        {
          this.presentToast("Timeout!!! Server did not respond");
        }
      });
    

  }

  onFileProgressChange=(progress):void=>
  {
    this.uploadProgress = Math.round((progress.loaded / progress.total) * 100);
    console.log("Progress=" + this.uploadProgress);
  }

  presentToast(text)
  {
    const toast = this.toastCtrl.create({

      message: text,
      duration: 3000
    });
    toast.present();
  }

  async calculateTimeout(file: Entry)
  {
    
    await file.getMetadata(metadata =>
    {
      const timeoutFor1MB = 25*1000; //Timeout for 1 MB;

      console.log(metadata);
      if (metadata != undefined)
      {
        if (metadata.size <= (1024 * 1024)) //Less than 1MB
        {
          this.loadingTimeout = 25 * 1000;
        }
        else
        {
          let sizeInMB = metadata.size / (1024 * 1024); //Metadata size will return size in bytes. We will convert this into MB
          this.loadingTimeout = sizeInMB * timeoutFor1MB; //5MB * 20 seconds 
        }
        
      }

    });
  }
}

