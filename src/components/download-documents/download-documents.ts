import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { MyStorageProvider } from '../../providers/my-storage/my-storage';

import { User } from '../../models/login_user.model';
import { ClientDocuments } from '../../models/client_document.model';

/**
 * Generated class for the DownloadDocumentsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'download-documents',
  templateUrl: 'download-documents.html'
})
export class DownloadDocumentsComponent {

  documentString: string;

  documentList: string[] = [];

  documentData: ClientDocuments[] = []; //To hold all the data about the document

  loggedInUser: User;

  constructor
    (
    public navParams: NavParams,
    public navCtrl: NavController,
    public inAppBrowser: InAppBrowser,
    public apiValue: ApiValuesProvider,
    public myStorage: MyStorageProvider
    )
  {
    console.log('Hello DownloadDocumentsComponent Component');
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad()
  {
    this.documentString = this.navParams.get('document');
    this.documentData = this.navParams.get('documentData');

    console.log('----------Doc. Received------');
    console.log(this.documentString);
    console.log(this.documentData);
    this.splitDocumentString();
  }

  splitDocumentString()
  {
    //Currently all documents are comming in a ',' separated string.

    this.documentList = this.documentString.split(',');
    console.log('----------Splitted String------');
    console.log(this.documentList);
  }

  dismissPage()
  {
    this.navCtrl.pop();
  }

  getDocument(doc:string)
  {
    let url = this.apiValue.baseFileUploadFolder + doc;
    this.inAppBrowser.create(url, '_system'); //_system indicated the O.S to open this link in the device's default browser
  }

  downloadAll()
  {

    //http://dsdlawfirm.com/dsd/api_work/downloadDocs.php?user_id=113&checkboxID[]=43,44,45
    let url = this.apiValue.baseURL + '/downloadDocs.php?user_id=' + this.loggedInUser.id + "&checkboxID[]=" + this.getCommaSeperatedDocumentString();
    console.log('Download URL sent=' + url);
    this.inAppBrowser.create(url, '_system'); //_system indicated the O.S to open this link in the device's default browser
  }

  getCommaSeperatedDocumentString(): string
  {
    let docString:string = '';
    for (let i = 0; i < this.documentData.length; i++)
    {
      if (i == (this.documentData.length - 1))
      {
        docString = docString + this.documentData[i].id; //For final one, don't add comma
      }
      else
      {
        docString = docString + this.documentData[i].id +',';
      }
    }
    return docString;
  }
}
