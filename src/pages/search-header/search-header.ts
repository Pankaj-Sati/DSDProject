import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Events} from 'ionic-angular';
import {Http,Headers,RequestOptions} from '@angular/http'
import {LoadingController,ToastController} from 'ionic-angular';
import {ApiValuesProvider} from '../../providers/api-values/api-values';
import {Case} from '../../models/case.model';
import {PopoverController} from 'ionic-angular';
import {ClientDetailsComponent} from '../../components/client-details/client-details';
import {CaseDetailsPage} from './case_details/case_details';
import {SingleClientPage} from '../client_list/single_client/single_client';

import { Client } from '../../models/client.model';
import { User } from '../../models/login_user.model';

import { MyStorageProvider } from '../../providers/my-storage/my-storage';

/**
 * Generated class for the SearchHeaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-header',
  templateUrl: 'search-header.html',
})
export class SearchHeaderPage 
{

  public searchText:string=""; //The string to search
  public error:string="";
  public cases: Case[] = [];

  public loggedInUser: User;

  constructor(public popoverCtrl:PopoverController,public apiValues:ApiValuesProvider,
  	public loadingCtrl:LoadingController,public toastCtrl:ToastController,
    public http: Http, public events: Events, public navCtrl: NavController,
    public navParams: NavParams, public myStorage: MyStorageProvider) 
  {
    this.loggedInUser = this.myStorage.getParameters();
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad SearchHeaderPage');
    this.searchText= this.navParams.get('searchText'); //Getting the search string passed by the app.component.ts
    console.log("Search text received="+this.searchText);
    //Now we will hide the search bar from the top
    this.events.publish("mainSearch"); //Publishing this event will cause the search bar visibility to toggle itself
    this.performSearch();
  }

  showDetails(caseObject:Case)
  {
  	
  //Once API return client ID, send it to single client details page
  let client:Client=new Client();
    client.cid = caseObject.client_id //Client ID
    client.id = caseObject.id //Client ID (Admin Table)
    let data =
    {
  		clientPassed:client
  	}
  	this.navCtrl.push(SingleClientPage,data);
      
        

  }


  performSearch()
  {
  	this.error=null;
  	this.cases=[];
  	if(this.searchText==null || this.searchText.length==0)
  	{
  		//We cannot search with empty string
  		this.error="Please enter a search string";
  		this.showToast(this.error);

  	}
  	else
  	{
  		let loader=this.loadingCtrl.create({
  			content:'Searching...',
  			duration:15000

  		});

  		let loadingSuccessful=false; //To check whether the loader timeout occured or not

  		loader.present().then(()=>{

  			let headers=new Headers();
  		

			let requestOptions=new RequestOptions({headers:headers});

			let data=new FormData();

              data.append('searchComman', this.searchText);
              data.append('user_type_id', this.loggedInUser.user_type_id);
	

  			this.http.post(this.apiValues.baseURL+"/header.php",data,requestOptions)
  			.map(response=>response.json())
  			.subscribe(serverReply=>{

  				console.log(serverReply);
  				loadingSuccessful=true; //Reaching this part means that server responded with a status code
  				if(serverReply)
  				{
  					if('code' in serverReply && Number(serverReply.code)>400)
  					{
  						//Server replied with a error code
  						this.error=serverReply.message;
  						this.showToast(serverReply.message);
  						loader.dismiss();
  					}
  					else
  					{
  					
  						this.error=null;
  						this.cases=serverReply;
  						loader.dismiss();
  					}
  				}
  				else
  				{
  					this.error="No response from server";
  					this.showToast(this.error);
  					loader.dismiss();
  				}
  			},error=>{

  				loadingSuccessful=true; //This will indicate that the loader did not timeout
  				this.error="Error in response!";
  				this.showToast(this.error);
  				console.log(error);
  				loader.dismiss();
  			});
  		});

  		loader.onDidDismiss(()=>{

  			if(! loadingSuccessful)
  			{
  				this.error='Access Denied! Check your internet connection'
  				this.showToast(this.error);
  			}
  		});
  	}
  }

  showToast(messageText)
  {
  	const toast=this.toastCtrl.create({
  		message:messageText,
  		duration:5000
  	});
  	toast.present();
  }
}
