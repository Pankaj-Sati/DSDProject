
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

  public baseURL: string ="http://dsdlawfirm.com/dsd/api_work/";
  public baseImageFolder: string ="http://dsdlawfirm.com/dsd/upload/";
  public baseFileUploadFolder: string ="http://dsdlawfirm.com/dsd/UploadFile/";
}
