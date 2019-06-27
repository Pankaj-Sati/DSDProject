
import {Http, Headers, RequestOptions}  from "@angular/http";
import "rxjs/add/operator/map";


export class ClientManagersListPage
{
	constructor(public http: Http)
	{

	}

	fetchList(http_request)
	{
		var headers=new Headers();
		headers.append("Accept", "application/json");
		headers.append("Content-Type", "application/json" );

		var options= new RequestOptions({headers:headers});

		var data={

		};

		http_request.post("http://jagdambasoftwaresolutions.com/dsd/api_work/get_advocate.php",data,options)

		.map(response=>response.json())
		.subscribe(serverReply=>{

			console.log(serverReply);

			if(serverReply==null||serverReply.length==0||serverReply[0].length==0)
			{
				return null;
			}
			else
			{
				return serverReply; 			
			}

		});


	}
}