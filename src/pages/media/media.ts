import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { AppAvailability } from '@ionic-native/app-availability';

@IonicPage()
@Component({
  selector: 'page-media',
  templateUrl: 'media.html',
})
export class MediaPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public inAppBrowser: InAppBrowser,
    public apiValue: ApiValuesProvider,
    public platform: Platform,
    public appAvailability: AppAvailability)
  {
  }

  openFacebookLink()
  {
    let fbUrlSchema = 'fb://'; //To open page url in Native Facebook App, we have different schemas.
    let fbUrl = 'fb://'; //URL for the facebook page to open directly in the application
    if (this.platform.is('ios'))
    {
      fbUrlSchema = 'fb://';
      fbUrl = 'fb://profile/' + this.apiValue.facebookPageName; //page is not working in iOS
    }
    else if (this.platform.is('android'))
    {
      fbUrlSchema = 'com.facebook.katana';
      fbUrl = 'fb://page/' + this.apiValue.facebookPageName;
    }
    else
    {
      //For browser platform
      fbUrlSchema = '';
      this.inAppBrowser.create(this.apiValue.facebookPageURL, '_blank'); //Open in the inApp Browser
      return;
    }

    this.appAvailability.check(fbUrlSchema).then((success) =>
    {
      //Facebook App is installed on the device
      this.inAppBrowser.create(fbUrl, '_system'); 
    },
      (err) =>
      {
        //Facebook App is not installed
        this.inAppBrowser.create(this.apiValue.facebookPageURL, '_blank'); //Open in the inApp Browser
      });
  }


  openGoogleReviewLink()
  {
    this.inAppBrowser.create('https://g.co/kgs/HRfqrX','_system'); //Open in the device default browser
  }
}
