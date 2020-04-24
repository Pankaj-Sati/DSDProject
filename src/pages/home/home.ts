import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaPage } from '../media/media';
import { ContactUsPage } from '../contact-us/contact-us';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage
{

  tabsPages: Array<{ component: any, title: string, icon: string }> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams)
  {
    this.tabsPages = [

      { component: DashboardPage, title: 'Home', icon: 'home' },
      { component: MediaPage, title: 'Media', icon: 'radio' },
      { component: ContactUsPage, title: 'Contact Us', icon: 'globe' },
    ];

  }


  ionViewDidLoad()
  {
    console.log('ionViewDidLoad HomePage');
  }

}
