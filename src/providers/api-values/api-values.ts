
import { Injectable } from '@angular/core';
import {  Headers} from "@angular/http";
/*
  Generated class for the ApiValuesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiValuesProvider {

  constructor() 
  {
    
  }

  public baseURL: string ="http://dsdlawfirm.com/dsd/api_work";
  public baseImageFolder: string ="http://dsdlawfirm.com/dsd/upload/";
  public baseFileUploadFolder: string = "http://dsdlawfirm.com/dsd/UploadFile/";

  //-------------------Teamup Calander Settings------------------------------//
  public TEAMUP_API_KEY: string = "e5b9e51f3297651794ceea6658f433b1fc8dccb562c072d09dd81de6c4260e30";
  public MAIN_APPOINTMENT_CALANDER: string = "6776892";
  public ADD_EVENT_URL: string = "https://api.teamup.com/ksje28dmta3n244jf9/events";

  get calendarHeaders():Headers
  {
    var headers = new Headers();
    headers.append('Teamup-Token', this.TEAMUP_API_KEY);
    headers.append('Content-Type', 'application/json');
    return headers;
  }
  


}
