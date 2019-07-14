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
  userKey: string = "loggedInUser";

  constructor(private storage: Storage) 
	{
    console.log('Hello MyStorageProvider Provider');
  }
	

  setParameters(user:User)
  {
    localStorage.setItem(this.userKey, JSON.stringify({ // localStorage is a built in global variable 
     
      id: user.id,
      name: user.name,
      email: user.email,
      user_type_id: user.user_type_id,
      profile_img: user.profile_img

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

  removeParameters()
  {
    localStorage.removeItem(this.userKey);

  }
	

}
