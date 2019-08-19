import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import { MyStorageProvider } from '../../providers/my-storage/my-storage';
import { User } from '../../models/login_user.model';

@IonicPage()
@Component({
  selector: 'page-common-calendar',
  templateUrl: 'common-calendar.html',
})
export class CommonCalendarPage
{
  calendarLink;
  loggedInUser: User;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sanitizer: DomSanitizer,
    public events: Events,
    public myStorage: MyStorageProvider)
  {
    this.calendarLink = this.sanitizer.bypassSecurityTrustResourceUrl("https://teamup.com/ksqn86pa626r69dvzg");
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonCalendarPage');
  }

  searchClient()
  {
    this.events.publish('mainSearch', 'ds'); //This event is defined in app.component.ts file
  }

}
