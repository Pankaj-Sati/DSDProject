import { Http,Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import {Events} from 'ionic-angular';

/*
  Generated class for the AdvocateListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdvocateListProvider {

  constructor(public http: Http,public events:Events) {
    console.log('Hello AdvocateListProvider Provider');
  }

  fetchList()
	{
		var headers=new Headers();
		headers.append("Accept", "application/json");
		headers.append("Content-Type", "application/json" );

		var options= new RequestOptions({headers:headers});

		var data={

		};

		this.http.post("http://jagdambasoftwaresolutions.com/dsd/api_work/get_advocate.php",data,options)

		.map(response=>response.json())
		.subscribe(serverReply=>{

			console.log(serverReply);
			let data=null;
			if(serverReply==null||serverReply.length==0||serverReply[0].length==0)
			{
				 data=null;
			}
			else
			{
				data= serverReply; 			
			}

			this.events.publish('advocateListEvent',data);
		});


	}

}
