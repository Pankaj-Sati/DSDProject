import { Component } from '@angular/core';
import { Events, NavParams, Platform, PopoverController } from 'ionic-angular';
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
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { ViewImageComponent } from '../../../../components/view-image/view-image';
import { DocumentOptionsComponent } from '../../../../components/document-options/document-options';

declare var cordova: any;

@Component({
  selector: 'document',
  templateUrl: 'document.html'
})

export class ClientDocumentsPage
{
  doc_list: ClientDocuments[] = [];
  visibility: boolean[] = []; //For showing document details

  uploadDocList = []; //Documents/images to be uploaded

  selectedDocList: ClientDocuments[] = [];
 
  passed_client_id;
  passed_advocate_id;
  passed_client_name;
  selected_file_name: string; //If user wanted to add a new file to upload
  loggedInUser: User;

  fileTransferObject: FileTransferObject;//To holde current instance of file transfer object

  uploadProgress: any = 0;

  isUploading: boolean = false; //To indicate whether currently any file is being uploaded

  blurAmount: string = ''; //To set blurr background class when modal opens

  loadingTimeout = 30 * 1000; //Default 30 seconds timeout for file upload
 
  constructor
    (
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
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
    public fileChooser: Chooser,
    public imagePicker: ImagePicker

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

  toggleDocumentDetails(document: ClientDocuments,clickEvent)
  {
    //Show and hide document details
   // this.visibility[index] = !this.visibility[index];

    console.log('toggleDocumentDetails');

    let data = {

      showDelete: this.loggedInUser != undefined && (Number(this.loggedInUser.user_type_id) != 5 || (Number(this.loggedInUser.user_type_id) == 5 && this.loggedInUser.id == document.created_by)), //Show delete option to client only when he is the creator of the document
      showShare: this.loggedInUser != undefined && Number(this.loggedInUser.user_type_id) != 5,
    }

    const popover = this.popoverCtrl.create(DocumentOptionsComponent, data);
    popover.present(
      {
        ev: clickEvent
      });

    popover.onDidDismiss(data =>
    {
      console.log('Popover dismissed');
      console.log(data);

      if (data != null && data != undefined && data.selectedOption != undefined)
      {
        switch (data.selectedOption)
        {
          case 0: //Download
            this.getDocument(document);
            break;
          case 1: //Delete
            this.deleteDocumentDialog(document);
            break;
          case 2: //Share

            this.showUpdateShareStatus(document);

            break;
        }
      }
    });

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
        documentData: this.doc_list,
        userID: this.passed_client_id
      };
    }

    else
    {
      //Download selected
      var data =
      {
        document: this.makeDocString(this.selectedDocList),
        documentData: this.selectedDocList,
        userID: this.passed_client_id
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

  getDocumentImage(doc: ClientDocuments)
  {
    //This method returns the thumbnail image of the document/image

    let documentName: string = doc.documents;
    let splitArray = documentName.split('.');
   
    let extention: string = '';
    let docThumbnail:string = 'assets/imgs/default_file.png'; //Default
    if (splitArray != undefined)
    {

      extention = splitArray[splitArray.length - 1].toLowerCase(); //Get the last item in the split array b/c extention is always at the ends 
      if (extention == 'jpg' || extention == 'png' || extention == 'jpeg' || extention == 'bmp') //Showing thumbnail of common image extentions
      {
        docThumbnail = this.apiValues.baseFileUploadFolder + doc.directory_id + '/' + doc.documents;
      }
      else if (extention == 'pdf')
      {
        docThumbnail = 'assets/imgs/pdf.png';
      }
      else if (extention == 'docx' || extention == 'doc') //Word Documents
      {
        docThumbnail = 'assets/imgs/word_file.png';
      }
      else
      {
        docThumbnail = 'assets/imgs/doc_file.png';//All other documents
      }
    }

    return docThumbnail;


  }

  fetchData()
  {

    this.doc_list = [];
    this.visibility = [];
    const loader = this.loadingCtrl.create({

      content: 'Loading...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.set('cid', this.passed_client_id);
      body.set('session_id', this.loggedInUser.id);

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
                for (let i = 0; i < this.doc_list.length;i++)
                {
                  this.visibility[i] = false;
                }
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
            this.getImagesFromGallery();
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

  async getImagesFromGallery()
  {

    let options: ImagePickerOptions = {
      width: 5000,
      height:5000
     
    };

    await this.imagePicker.hasReadPermission().then(hasPermission =>
    {
      if (!hasPermission)
      {
        this.imagePicker.requestReadPermission();
      }
    });

    await this.imagePicker.getPictures(options).then((result) =>
    {
      console.log('GOt image Picker result');

      console.log(result);

      if (result != undefined && result.length > 0 && result instanceof Array)
      {
        for (let eachImage of result)
        {
          this.uploadDocList.push(eachImage);
        }
      }

      this.checkForMoreUploads();

    });
  }

  takeFile()
  {
    console.log('In Take File()');
   
    this.fileChooser.getFile('')
      .then(file =>
      {
        console.log(file);
        if (file)
        {
          console.log('File selected');
          console.log('File Name=' + file.name);
         // console.log('Data URI=' + file.dataURI);
         // console.log('Data=' + file.data);
          console.log('Media Type=' + file.mediaType);
          console.log('URI=' + file.uri);
          console.log('Data=' + file.data);
          
        

           this.uploadDocList.push(file.uri);
        
           this.checkForMoreUploads();
         
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
      sourceType: source,
      allowEdit: true
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

      this.uploadDocList.push(cordova.file.dataDirectory + newFileName);
      this.checkForMoreUploads();

    }, error =>
      {

        this.presentToast('Error in storing image file');
      });
  }

  async uploadFile( filepath)
  {
    console.log('In File Upload');
    console.log('Uploading File:' + filepath);
    console.log('Is Uploading=' + this.isUploading);
    if (this.isUploading)
    {
      return; //Currently we are uploading a file
    }

    
   
    this.loadingTimeout = 30 * 1000; //Default;

    let fileInfo: Entry = undefined;
    await this.file.resolveLocalFilesystemUrl(filepath).then(file =>
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

    this.fileTransferObject = this.fileTransfer.create();
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
    this.fileTransferObject.upload(filepath, this.apiValues.baseURL + '/client_doc_upload.php', options).then(data =>
      {

      transferSuccessful = true;
      this.isUploading = false;
        console.log(" upload server reply");
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
             
            }
            else
            {
              //Success
             
              this.presentToast(response.message);

             
            
            }
          }
          catch (err)
          {
            console.log(err);
            this.presentToast('Error in response');
           
           
          }
          
        }
        else
        {
          this.presentToast("Failed!! Server returned an error");
         
        }

       this.removeFilesFromUpload(0);
       this.checkForMoreUploads();

      }, err =>
        {
        this.isUploading = false;
          console.log(err);
          transferSuccessful = true;
          this.presentToast("Failed!! Server returned an error");
          //loader.dismiss();
        this.removeFilesFromUpload(0); //Remove the first element i.e. the current codument from list
        this.checkForMoreUploads();

        })
        .catch(err =>
        {
          this.isUploading = false;
          transferSuccessful = true;
          console.log(err);
          this.presentToast("Failed!! Server returned an error");
         // loader.dismiss();
          this.removeFilesFromUpload(0); //Remove the first element i.e. the current codument from list
          this.checkForMoreUploads();

        });

  

    this.fileTransferObject.onProgress((progress) =>
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

  removeFilesFromUpload(documentIndex)
  {
    if (this.uploadDocList.length <= 0)
    {
      return;
    }

    this.uploadDocList.splice(documentIndex, 1);//Remove the specific document
  }

  cancelUpload(cancelAll=false)
  {
    if (this.fileTransferObject)
    {
      this.fileTransferObject.abort();
    }

    if (cancelAll)
    {
      this.uploadDocList = [];
    }

  }

  getDocName(fullPath:string)
  {
    return fullPath.substring(fullPath.lastIndexOf('/'));
  }

  checkForMoreUploads()
  {
    console.log('In Checkfor More Uploads');

    console.log(this.uploadDocList);
    if (this.uploadDocList.length > 0)
    {
      let currentDoc = String(this.uploadDocList[0]);
      this.selected_file_name = currentDoc.substring(currentDoc.lastIndexOf('/'));
      this.uploadFile(this.uploadDocList[0]); //Upload the first file in the list
    }
    else
    {
      this.fetchData();
    }
  }

  deleteDocumentDialog(doc: ClientDocuments)
  {
    //Show dialog to confirm deletion of documents

    const alert = this.alertCtrl.create({
      message: 'Are you sure that you want to delete this document?',
      title: 'Confirm Delete',
      buttons: [
        {
          text: 'Cancel',
          handler: () =>
          {
            console.log('Cancelled');
          }
        },
        {
          text: 'Confirm',
          handler: () =>
          {
            console.log('Delete confirmed');
            this.deleteDocument(doc);
          }
        }
      ]
    });

    alert.present();
  }

  deleteDocument(document: ClientDocuments)
  {
    const loader = this.loadingCtrl.create({

      content: 'Deleting...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.set('session_id', this.loggedInUser.id);
      body.set('document_id', document.id);

      this.http.post(this.apiValues.baseURL + "/delete_document.php", body, null)
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
                if (data.code == 200)
                {
                  this.fetchData(); //Refresh the data
                } 
              }
              else
              {
                this.showToast('Failure!!! Error in response');
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
            this.showToast('Failure! Server did not respond');
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

  showUpdateShareStatus(document: ClientDocuments)
  {
    const alert = this.alertCtrl.create({
      title:'Share With Client',
      message: 'Would you like to share this document with your client?',
      inputs: [
        {
          type: 'radio',
          label: 'Yes',
          checked: document.share == 'Yes',
          value: 'Yes',
        },
        {
          type: 'radio',
          label: 'No',
          checked: document.share == 'No',
          value:'No'
        }
      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () =>
          {
            console.log('Cancelled! Update share status');
          }
        },
        {
          text: 'Update',
          handler: (data) =>
          {
            console.log('Value from radio=' + data);
            this.updateShareStatus(document,data);
          }
        }
      ]
    });
    alert.present();
  }

  updateShareStatus(document: ClientDocuments,isShared)
  {
    console.log('In updateShareStatus()');

    const loader = this.loadingCtrl.create({

      content: 'Updating...',
      duration: 15000

    });

    let loadingSuccessful = false; //To know whether the loader ended successfully or timeout occured

    loader.present().then(() =>
    {

      let body = new FormData();

      body.set('session_id', this.loggedInUser.id);
      body.set('document_id', document.id);
      body.set('share', isShared);

      this.http.post(this.apiValues.baseURL + "/change_document_share_status.php", body, null)
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
                if (data.code == 200)
                {
                  this.fetchData(); //Refresh the data
                }
              }
              else
              {
                this.showToast('Failure!!! Error in response');
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
            this.showToast('Failure! Server did not respond');
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

  viewDocument(doc: ClientDocuments)
  {
    //This method will open an image file in image view component, and document file in browser
    let documentName: string = doc.documents;
    let splitArray = documentName.split('.');
    let extention: string = '';
    if (splitArray != undefined)
    {

      extention = splitArray[splitArray.length - 1].toLowerCase(); //Get the last item in the split array b/c extention is always at the ends 
      if (extention == 'jpg' || extention == 'png' || extention == 'jpeg' || extention == 'bmp') //Showing thumbnail of common image extentions
      {
        let data =
        {
          imageURL: this.apiValues.baseFileUploadFolder + doc.directory_id + '/' + doc.documents
        };
        this.navCtrl.push(ViewImageComponent, data); //Show image in the view image component
      }
      else
      {
        this.inAppBrowser.create(this.apiValues.baseFileUploadFolder + doc.directory_id + '/' + doc.documents, '_system');
      }
    }
  }
}

