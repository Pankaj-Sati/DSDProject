import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../../models/login_user.model';

/*
  Generated class for the MyStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class MyStorageProvider 
{
  private readonly userKey: string = "loggedInUser"; //To save info about the logged in user
  private readonly lastUsedKey: string = "lastUsed";  //To save time(in miliseconds) of the last time app was opened

  constructor(private storage: Storage) 
	{
    console.log('Hello MyStorageProvider Provider');
  }
	

  setParameters(user:User)
  {
    console.log('---Parameters to set in storage---');
    console.log(user);
    localStorage.setItem(this.userKey, JSON.stringify({ // localStorage is a built in global variable 
     
      id: user.id,
      name: user.name,
      email: user.email,
      user_type_id: user.user_type_id,
      profile_img: user.profile_img,
      contact: user.contact,
      calendar_link: user.calendar_link,
     
    }));
  }

  getParameters():User
  {
    let user: User;
    user = JSON.parse(localStorage.getItem(this.userKey));
    console.log("---User Get Local Storage---");
    console.log(user);
    
    return user;
  }

  setLastUsed(timeInSeconds:number)
  {
    localStorage.setItem(this.lastUsedKey, String(timeInSeconds));
  }

  getLastUsed(): number
  {
    return Number(localStorage.getItem(this.lastUsedKey));
  }

  removeParameters()
  {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.lastUsedKey);

  }
	

}
