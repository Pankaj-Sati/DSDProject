import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../login/login';

@Component({
  selector: 'signup_success',
  templateUrl:'signup_success.html'
})
export class SignupSuccessPage
{

  passed_email='';
  passed_contact='';

  constructor
    (public navCtrl: NavController,
    public navParams: NavParams)
  {

  }

  ionViewDidLoad()
  {
    this.passed_contact = this.navParams.get('contact');
    this.passed_email = this.navParams.get('email');

    console.log('--Values Received--');
    console.log('Email='+this.passed_email + ' Contact=' + this.passed_contact);
  }

  login()
  {
    this.navCtrl.setRoot(LoginPage);
  }
}
