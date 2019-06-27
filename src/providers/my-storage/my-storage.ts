import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the MyStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MyStorageProvider 
{
	U_ID="id";
	U_NAME="name";
	U_EMAIL="email";
	U_USERTYPEID="usertype_id";
	U_PROFILEIMG="profile_img";

  constructor(public http: HttpClient, private storage: Storage) 
	{
    console.log('Hello MyStorageProvider Provider');
  }
	
static get parameters() {
  return [[HttpClient], [Storage]];
}
	

}
