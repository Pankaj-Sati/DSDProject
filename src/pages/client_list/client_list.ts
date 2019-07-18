import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions}  from "@angular/http";

import { LoadingController } from "ionic-angular";
import { ToastController } from 'ionic-angular';
import "rxjs/add/operator/map";
import {Events} from 'ionic-angular';

import{AddClientPage} from './add_client/add_client';
import{SingleClientPage} from './single_client/single_client';

import { ApiValuesProvider } from '../../providers/api-values/api-values';
import { CaseTypeProvider } from '../../providers/case-type/case-type';
import { AdvocateListProvider } from '../../providers/advocate-list/advocate-list';
import { AdvocateDropdown } from '../../models/ advocate.model';

import { Client } from '../../models/client.model';
import { CaseType } from '../../models/case_type.model';

@Component({
  selector: 'client_list',
  templateUrl: 'client_list.html'
})


export class ClientListPage
{

  clients: Client[]=[];
	c_case_type:string='';
	c_case_year:string='';
	c_case_category:string='';
	c_case_manager:string='';
	c_search:string='';

  caseTypeList: CaseType[] = [];
	advocateList:AdvocateDropdown[]=[];

  constructor(public advocateListProvider: AdvocateListProvider,
    public caseTypeProvider: CaseTypeProvider,
		public events:Events,
		public apiValue:ApiValuesProvider,
		public navCtrl: NavController, 
		public navParams: NavParams, 
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,  
		private http: Http,  
		public loading: LoadingController)
    {

      if (this.caseTypeProvider.isEmpty)
      {
        this.showToast('Failure!!! Cannot get case types');
      }
      this.caseTypeList = this.caseTypeProvider.caseTypeList;

		this.getadvocateList();
        
    }

  ionViewDidEnter()
  {
    console.log('ionViewDidEnter()');
    console.log(this.navParams.data.reload);
    if (this.navParams.data.reload)
    {
      this.fetchData();
    }

  }

    getadvocateList()
    {
    	const loader=this.loading.create({

    		content:'Loading...',
    		duration:15000
    	});
    	loader.present();
    	let loadingSuccessful=false; //To know whether timeout occured or not

    	this.advocateListProvider.getAdvocateList().subscribe(response=>
    	{
    		if(response)
    		{
    			loadingSuccessful=true;
    			loader.dismiss();
    			try
    			{
    				let reply=JSON.parse(response['_body']);
    				if('code' in reply || 'message' in reply)
    				{
    					//Error
    					this.showToast(reply.message);
    				}
    				else
    				{
    					this.advocateList=reply;
    					this.fetchData();
    				}
    			}
    			catch(err)
    			{

    			}
    			
    		}
    		else
    		{
    			loadingSuccessful=true;
    			loader.dismiss();
    			this.showToast('Failed to get data from server');
    		}
    	},error=>
    	{
    		console.log(error);
    		loadingSuccessful=true;
    			loader.dismiss();
    			this.showToast('Failed to get data from server');
    	});

    	loader.onDidDismiss(()=>{

    		if(! loadingSuccessful)
    		{
    			this.showToast('Failure!!! Server did not respond');
    		}
    	});
    }

    addClient()
    {
    	console.log('addClient() clicked');
    	this.navCtrl.push(AddClientPage);
    }

    searchClient()
	{
		this.events.publish('mainSearch','ds'); //This event is defined in app.component.ts file
	}

   fetchData()
	{
	
	   var headers = new Headers();
	   this.clients=[];

       headers.append("Accept", "application/json");

       headers.append("Content-Type", "application/json" );

       let options = new RequestOptions({ headers: headers });

  

        //Data to be sent to the server
       				
		let body=new FormData();
			    body.append('case_type',this.c_case_type);
			    body.append('year',this.c_case_year);
			    body.append('case_category',this.c_case_category);
			    body.append('advocate_id',this.c_case_manager);
			    body.append('keyword',this.c_search);

			    console.log('Case Type Selected:'+this.c_case_type);
			    console.log('Advocate Id Selected:'+this.c_case_manager);
			    console.log('Keyword:'+this.c_search);

        
		let loader = this.loading.create({

          content: "Loading ...",
          duration:15000

		 });
     let loadingSuccessful = false;//To know whether timeout occured or not
	   loader.present().then(() => 
		{

	   this.http.post(this.apiValue.baseURL+"/client_list.php",body,null) //Http request returns an observable

	   .map(response => response.json()) ////To make it easy to read from observable

	   .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data
				  
       {
         loadingSuccessful = true;
		   			console.log(serverReply);
		   			loader.dismiss();

		   				if('message' in serverReply || 'code' in serverReply)
		   				{
		   						this.showToast(serverReply.message)
		   				}
		   				else
		   				{
		   					this.clients=serverReply;
		   				}
				 
			      

       }, error =>
         {
           loadingSuccessful = true;
           console.log(error);

           this.showToast('Error in getting data');
           loader.dismiss();

         });

       });

     loader.onDidDismiss(() =>
     {
       if (!loadingSuccessful)
       {
         this.showToast('Timeout!!! Server did not respond');
       }
     });
		

    }

   showToast(text)
   {
   	const toast = this.toastCtrl.create({
			  message: text,
			  duration: 3000
			});
			toast.present();
   }

    viewClient(client:Client)
    {

    	console.log(client);
    	let data={
    		clientPassed:client
    	};

    	this.navCtrl.push(SingleClientPage,data);
    }

}
