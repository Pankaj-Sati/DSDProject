import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


/**
 * This component displays an image in full screen
 */
@Component({
  selector: 'view-image',
  templateUrl: 'view-image.html'
})
export class ViewImageComponent {

  imageUrl: string='';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public inAppBrowser: InAppBrowser)
  {
    console.log('Hello ViewImageComponent Component');  
  }

  ionViewDidLoad()
  {
    this.imageUrl = this.navParams.get('imageURL');
    console.log('Received Image URL=' + this.imageUrl);
  }

  downloadImage()
  {
    this.inAppBrowser.create(this.imageUrl, '_system');
  }


}
