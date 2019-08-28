import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiValuesProvider } from '../../providers/api-values/api-values';

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public inAppBrowser: InAppBrowser,
    public apiValue: ApiValuesProvider)
  {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }

  openMaps()
  {
    this.inAppBrowser.create(this.apiValue.mapsLink, '_system');
  }

  callUs()
  {
    this.inAppBrowser.create(this.apiValue.contactNumber, '_system');
  }

  openWebsite()
  {
    this.inAppBrowser.create(this.apiValue.websiteLink, '_system');
  }

  emailUs()
  {
    this.inAppBrowser.create(this.apiValue.emailLink, '_system');
  }

}
