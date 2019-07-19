import { Component } from '@angular/core';
import { Events, NavParams, Platform } from 'ionic-angular';
import { LoadingController, ToastController, NavController, NavOptions, AlertController, ModalController } from 'ionic-angular';
import { Http } from "@angular/http";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer'
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';

import {DownloadDocumentsComponent } from '../../../../components/download-documents/download-documents';
import { ApiValuesProvider } from '../../../../providers/api-values/api-values';
import { MyStorageProvider } from '../../../../providers/my-storage/my-storage';

import { ClientDocuments } from '../../../../models/client_document.model';
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
  selected_file_name: string; //If user wanted to add a new file to upload
  lastImage; //Last selected Image
  loggedInUser: User;
 
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
    public myStorage: MyStorageProvider

    )
  {
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad()
  {
    console.log('Client Documents: ionViewDidLoad');

    this.passed_client_id = this.navParams.get('client_id');

    console.log('Client Id Received:' + this.passed_client_id);
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
      document: document.documents
    };
    const modal = this.modalCtrl.create(DownloadDocumentsComponent, data);
    modal.present();
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
        document: this.makeDocString(this.doc_list)
      };
    }

    else
    {
      //Download selected
      var data =
      {
        document: this.makeDocString(this.selectedDocList)
      };
    }

    const modal = this.modalCtrl.create(DownloadDocumentsComponent, data);
    modal.present();
  }

  makeDocString(docArray: ClientDocuments[]): string
  {
    //To make a comma seperated string out of the documents to be downloaded
    let str:string = '';
    for (let i = 0; i < docArray.length; i++)
    {
      if (i == docArray.length - 1)
      {
        str = str + docArray[i].documents;
      }
      else
      {
        str = str + docArray[i].documents + ',';
      }
    }
    return str;
  }

  documentSelected(doc: ClientDocuments)
  {
    console.log('---In Document Selected---');
   
    let index = this.selectedDocList.findIndex(document => document.id == doc.id);
    console.log('index=' + index);
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
    console.log('Result='+result);
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
              this.selected_file_name = currentName;
              
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
          this.selected_file_name = currentName;

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

  copyFileToLocalDir(correctPath, currentName, newFileName)
  {
    this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, newFileName).then(success =>
    {

      this.lastImage = cordova.file.dataDirectory + newFileName;

    }, error =>
      {

        this.presentToast('Error in storing image file');
      });
  }

  uploadFile()
  {
       let transfer: FileTransferObject = this.fileTransfer.create();

      let filename = this.lastImage.substr(this.lastImage.lastIndexOf('/') + 1);
      var options =
      {
        fileKey: "doc",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: {

          "cid": this.passed_client_id,
          "folder_id": this.passed_client_id, //On server, a folder is created with the name=Client ID to store all doucments of that client in it 

          "session_id": this.loggedInUser.id

        }
      };

    let loader = this.loadingCtrl.create({

        content: "Uploading...",
        duration: 25000
      });

      let transferSuccessful = false; //To know whether timeout occured or not

      loader.present();
    
    //this.apiValues.baseURL + '/client_doc_upload.php'
    transfer.upload(this.lastImage, this.apiValues.baseURL + '/client_doc_upload.php', options).then(data =>
      {

        transferSuccessful = true;
        console.log("Image upload server reply");
        console.log(data);

        if (data)
        {
          if (JSON.parse(data["_body"])['code'] > 400)
          {
            //Error returned from server
            this.presentToast(JSON.parse(data["_body"])['message']);
            loader.dismiss();
            return;
          }
          else
          {
            
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

      }, err =>
        {

          console.log(err);
          transferSuccessful = true;
          this.presentToast("Failed!! Server returned an error");
          loader.dismiss();

        })
        .catch(err =>
        {

          transferSuccessful = true;
          console.log(err);
          this.presentToast("Failed!! Server returned an error");
          loader.dismiss();

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

  presentToast(text)
  {
    const toast = this.toastCtrl.create({

      message: text,
      duration: 3000
    });
    toast.present();
  }
}

