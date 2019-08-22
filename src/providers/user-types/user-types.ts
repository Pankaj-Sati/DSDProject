import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import {Events } from 'ionic-angular';

import { UserType } from '../../models/user_type.model';
import { ApiValuesProvider} from '../../providers/api-values/api-values';

@Injectable()
export class UserTypesProvider
{
  public userTypeList: UserType[]=[]; //To store the user type list

  constructor(public http: Http,
    public events: Events,
    public apiValue: ApiValuesProvider)
  {
    console.log('Hello UserTypesProvider Provider');
  }

  fetchList()
  {
    let success =false;
    this.http.get(this.apiValue.baseURL + '/get_user_types.php').subscribe(response =>
    {
      console.log(response);

      if (response)
      {
        try
        {
          let result = JSON.parse(response['_body']);
          if ('message' in result)
          {
            //Server returned an error
            this.events.publish('user_type_list_event', success);
          }
          else
          {
            //Server returned a list
            this.userTypeList = result;
            console.log('------User Type List---');
            console.log(this.userTypeList);

            success = true;
            this.events.publish('user_type_list_event', success);
          }
        }
        catch (err)
        {
          console.log(err);
          this.events.publish('user_type_list_event', success);
        }
      }
      else
      {
        this.events.publish('user_type_list_event', success);
      }
    }
      , error =>
      {
        console.log(error);
        this.events.publish('user_type_list_event', success);
      });

    

  }

  getUserTypeName(id)
  {
    let userType = this.userTypeList.find(eachType => eachType.id == id);
    if (userType != undefined && userType!=null)
    {
      return userType.name;
    }

    return 'N/A';
  }

}
