import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

import { CaseType } from '../../models/case_type.model';
import { ApiValuesProvider } from '../api-values/api-values';
import { Observable } from 'rxjs';

@Injectable()
export class CaseTypeProvider
{

  caseTypeList: CaseType[]=[];

  constructor
    (
    public http: Http,
    public apiValues: ApiValuesProvider,
    public events: Events
  )
  {
    console.log('Hello CaseTypeProvider Provider');
  }

  fetchList()
  {
    this.caseTypeList = [];
    this.http.get(this.apiValues.baseURL + '/get_case_type.php')
      .subscribe(response =>
      {
        console.log('-------Get Case Type List---------');
        console.log(response);

        if (response)
        {
          try
          {
            let data = JSON.parse(response['_body']);
            if ('code' in data)
            {
              //Failure
              this.events.publish('get_case_types', false); //False indicates that list cannot be successfully downloaded
            }
            else
            {
              this.caseTypeList = data;
              //Success
              this.events.publish('get_case_types', true); //True indicates that list was successfully downloaded

            }
          }
          catch (err)
          {
            console.log(err);
            //Failure
            this.events.publish('get_case_types', false); //False indicates that list cannot be successfully downloaded

          }
        }
      },
        error =>
        {
          console.log(error);
          //Failure
          this.events.publish('get_case_types', false); //False indicates that list cannot be successfully downloaded

        });
  }

  public get isEmpty(): boolean
  {
    //True for empty and false for not empty
    return this.caseTypeList.length == 0; 
  }

  public get list(): CaseType[]
  {
    return this.caseTypeList;
  }

  getCaseType(id: number):string
  {
    if (this.isEmpty)
    {
      return String(id); //Don't execute further
    }

    let caseType = this.caseTypeList.find(casetype => casetype.id == id);
    return (caseType!=undefined && caseType!=null)?caseType.case_type:String(id); //Returnt the name if found else the id passed
  }

  getCaseTypeNo(name: string)
  {
    if (this.isEmpty)
    {
      return String(name); //Don't execute further
    }

    let caseType = this.caseTypeList.find(casetype => casetype.case_type === name);
    return (caseType != undefined && caseType != null) ? caseType.id : String(name); //Returnt the name if found else the id passed

  }


}
