import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { MediaPage } from '../media/media';
import { ContactUsPage } from '../contact-us/contact-us';

@IonicPage()
@Component({
  selector: 'page-front',
  templateUrl: 'front.html',
})
export class FrontPage
{

  tabsPages: Array<{ component: any, title: string, icon: string }> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams)
  {
    this.tabsPages = [
      { component: LoginPage, title: 'Menu', icon: 'menu' },
      { component: MediaPage, title: 'Media', icon: 'radio' },
      { component: ContactUsPage, title: 'Contact Us', icon: 'globe' },
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FrontPage');
  }

}
