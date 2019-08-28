import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiValuesProvider } from '../../providers/api-values/api-values';

@IonicPage()
@Component({
  selector: 'page-media',
  templateUrl: 'media.html',
})
export class MediaPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public inAppBrowser: InAppBrowser,
    public apiValue: ApiValuesProvider)
  {
  }

  ionViewDidEnter()
  {
    this.inAppBrowser.create(this.apiValue.facebookPageURL, '_blank');
  }

  openLink()
  {
    this.inAppBrowser.create(this.apiValue.facebookPageURL, '_blank');
  }

}
