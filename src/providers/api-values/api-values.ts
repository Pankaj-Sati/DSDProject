
import { Injectable } from '@angular/core';

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

  public baseURL:string="http://myamenbizzapp.com/dsd/api_work";
  public baseImageFolder:string="http://myamenbizzapp.com/dsd/upload/";
  public baseFileUploadFolder:string="http://myamenbizzapp.com/dsd/UploadFile/";
}
