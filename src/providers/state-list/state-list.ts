import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import { State } from '../../models/state.model';

import { ApiValuesProvider} from '../../providers/api-values/api-values';

@Injectable()
export class StateListProvider
{
  public stateList: State[] = [];

  constructor(public http: Http,
    public events: Events,
    public apiValues: ApiValuesProvider)
  {
    console.log('Hello StateListProvider Provider');
  }

  get isEmpty(): boolean
  {
    return (this.stateList==undefined ||this.stateList.length == 0) ? true : false
  }

  fetchList()
  {
    this.stateList = [];
    this.http.get(this.apiValues.baseURL + '/state_list.php')
      .subscribe(response =>
      {
        console.log('-------Get States List---------');
        console.log(response);

        if (response)
        {
          try
          {
            let data = JSON.parse(response['_body']);
            if ('code' in data)
            {
              //Failure
              this.events.publish('get_states', false); //False indicates that list cannot be successfully downloaded
            }
            else
            {
              this.stateList = data;
              //Success
              this.events.publish('get_states', true); //True indicates that list was successfully downloaded

            }
          }
          catch (err)
          {
            console.log(err);
            //Failure
            this.events.publish('get_states', false); //False indicates that list cannot be successfully downloaded

          }
        }
      },
        error =>
        {
          console.log(error);
          //Failure
          this.events.publish('get_states', false); //False indicates that list cannot be successfully downloaded

        });
  }

}
