import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { ApiValuesProvider} from '../../providers/api-values/api-values';

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

  documentList: string[]=[];

  constructor
    (
    public navParams: NavParams,
    public navCtrl: NavController,
    public inAppBrowser: InAppBrowser,
    public apiValue: ApiValuesProvider
    )
  {
    console.log('Hello DownloadDocumentsComponent Component');
    
  }

  ionViewDidLoad()
  {
    this.documentString = this.navParams.get('document');
    console.log('----------Doc. Received------');
    console.log(this.documentString);
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
}
