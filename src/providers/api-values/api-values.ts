
import { Injectable } from '@angular/core';
import {  Headers} from "@angular/http";
/*
  This class stores some commom constants that are used throughtout the app
  With this approach it is easier to change the value in a single place than to change it everywhere in the app
*/
@Injectable()
export class ApiValuesProvider
{
  private maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString();

  constructor() 
  {
    
  }

  public readonly baseURL: string ="http://dsdlawfirm.com/dsd/api_work";
  public readonly baseImageFolder: string ="http://dsdlawfirm.com/dsd/upload/";
  public readonly baseFileUploadFolder: string = "http://dsdlawfirm.com/dsd/UploadFile/";

  //---------------Facebook Page Link-----------------------//
  public readonly facebookPageURL = 'https://www.facebook.com/dsdlawfirm/';
  public readonly facebookPageName = '384972328368926';

  //---------------------Maps Location---------------------------//
  public readonly mapsLink = 'https://goo.gl/maps/kD3gS4M9hvge6nPM8';

  //---------------Contact Number--------------------------------//
  public readonly contactNumber = 'tel:2124282000';

  //---------------Email Link--------------------------------//
  public readonly emailLink = 'mailto:info@dsdlawfirm.com';

  //-------------------Website link---------------------------//
  public readonly websiteLink = 'http://dsdlawfirm.com';

  //-------------------Teamup Calander Settings------------------------------//
  public TEAMUP_API_KEY: string = "e5b9e51f3297651794ceea6658f433b1fc8dccb562c072d09dd81de6c4260e30";
  public MAIN_APPOINTMENT_CALANDER: string = "6776892";
  public ADD_EVENT_URL: string = "https://api.teamup.com/ksje28dmta3n244jf9/events";


  //--------------------- Input Validator----------------------------//
  public readonly INPUT_VALIDATOR=/^$|^([a-zA-Z]{2}.{0,50})$/;
  public readonly ADDRESS_VALIDATOR=/^$|^([a-zA-Z0-9]{2}.{0,100})$/;
  public readonly ZIPCODE_VALIDATOR=/^$|^([0-9]{4,6})$/;
  public readonly LONG_TEXT_VALIDATOR =/^$|^([a-zA-Z0-9]{2}.{0,500})$/;
  public readonly ALIEN_NO_VALIDATOR =/^$|^([a-zA-Z0-9]{2}.{0,30})$/;
  

  get maxSelectableDate():any
  {
    //This method returns the maximum selectable date troughout the app
    return this.maxDate;
  }


  get calendarHeaders():Headers
  {
    var headers = new Headers();
    headers.append('Teamup-Token', this.TEAMUP_API_KEY);
    headers.append('Content-Type', 'application/json');
    return headers;
  }
  


}
