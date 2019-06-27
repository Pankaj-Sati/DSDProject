import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav} from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { RemindersPage } from '../pages/reminders/reminders';
import { NotificationsPage } from '../pages/notifications/notifications';
import { AddUserPage } from '../pages/add_user/add_user';
import { UserListPage } from '../pages/user_list/user_list';
import { UserProfilePage } from '../pages/user_profile/user_profile';
import { ClientListPage } from '../pages/client_list/client_list';
import { AccountManagementPage } from '../pages/account_management/account_management';
import { AccountSummaryPage } from '../pages/account_management/account_summary/account_summary';
import { CaseStudyPage } from '../pages/case_study/case_study';
import {SettingUserTypePage} from '../pages/settings/user_type/usertype';
import {SettingCaseTypePage} from '../pages/settings/casetype/casetype';
import {SMSBulkEmailPage} from '../pages/sms/bulkemail/bulkemail';
import {SMSListPage} from '../pages/sms/smslist/smslist';
import {SearchHeaderPage} from '../pages/search-header/search-header';
import {ApiValuesProvider} from '../providers/api-values/api-values';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { Events } from 'ionic-angular';

@Component(
{
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage:any =null;
  pages: Array<{title: string, icon: string,component: any, subs:Array<{title: string, icon: string,component: any}>, hasSub:boolean}>;
  settingPages: Array<{title: string, icon: string,component: any}>;
  userPages: Array<{title: string, icon: string,component: any}>;
  clientPages: Array<{title: string, icon: string,component: any}>;
  smsPages: Array<{title: string, icon: string,component: any}>;
  caseStudyPages: Array<{title: string, icon: string,component: any}>;
  accountManagementPages: Array<{title: string, icon: string,component: any}>;

   U_ID="id";
   U_NAME="name";
	 U_EMAIL="email";
   U_PROFILEIMG="profile_img";

  
   u_name: string="App User";
   u_email:string;
   u_img: string="../assets/imgs/generic_user.png";
   showSearch:boolean;
   header_title:string;

  constructor(
    public apiValues:ApiValuesProvider,
    public events: Events,
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
	  public storage: Storage
  ) 
  {
    this.checkIfAlreadyLoggedIn();
    this.initializeApp();

    this.showSearch=false;


    this.events.subscribe('loggedIn',()=>{
    // user and time are the same arguments passed in `events.publish(user, time)`
    console.log('Welcome: Gettting image');
   
            this.initializeApp();

      });

    events.subscribe('newPage',(title)=>{
      console.log(title);
      this.header_title=title
    });

    events.subscribe('mainSearch',(show)=>{

      this.showSearch=! this.showSearch;
    });
    //set subPages
      this.settingPages=[
      { title: 'User Type', icon: 'home' ,component: SettingUserTypePage},
      { title: 'Case Type', icon: 'home' ,component: SettingCaseTypePage}
      ];

      this.userPages=[
          { title: 'User List', icon:'contact',component: UserListPage}
      ];

        this.clientPages=[
        { title: 'Client List', icon:'people', component: ClientListPage},
      ];
        this.smsPages=[

          { title: 'Bulk Emails', icon:'contact',component: SMSBulkEmailPage},
        { title: 'SMS List', icon:'list-box',component: SMSListPage}
      ];

      this.caseStudyPages=[
        { title: 'Case Study List', icon:'people', component: CaseStudyPage},
      ];

      this.accountManagementPages=[
        { title: 'User Account Management', icon:'people', component: AccountManagementPage},
        { title: 'Account Management', icon:'bookmarks', component: AccountSummaryPage}
      ];

    // set our app's pages
    this.pages = [
    
      { title: 'Dashboard', icon: 'home' ,component: DashboardPage,subs:null,hasSub:false},

      { title: 'Settings', icon: 'settings' ,component: null,subs:this.settingPages,hasSub:false},

      { title: 'Users', icon: 'contacts' ,component: null,subs:this.userPages,hasSub:false},

      { title: 'Case Management', icon: 'filing' ,component: null,subs:this.clientPages,hasSub:false},

     
      { title: 'Account Management', icon:'archive', component: null,subs:this.accountManagementPages,hasSub:false },

      { title: 'SMS', icon:'send', component: null,subs:this.smsPages,hasSub:false },
   
       
      { title: 'Reminders', icon:'clock', component: RemindersPage,subs:null,hasSub:false },
      
      { title: 'Notifications', icon:'notifications',component: NotificationsPage,subs:null,hasSub:false },

      { title: 'Case Study', icon:'paper', component: null,subs:this.caseStudyPages,hasSub:false },

     { title: 'File Test', icon:'paper', component: HelloIonicPage,subs:null,hasSub:false },

      { title: 'Logout', icon:'log-out', component: LogoutPage,subs:null,hasSub:false }
    
    ];
  }

  checkIfAlreadyLoggedIn()
  {
    

    this.storage.get(this.U_ID).then((value) => {

      if(value!=undefined && value !=null && value.length>0)
        {
          this.rootPage=DashboardPage;
          
        }
      else
      {
        this.nav.setRoot(LoginPage);
      }

    });; 
        
      
  }

  initializeApp() 
  {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

	  
	  this.storage.get(this.U_NAME).then((value) => 
			  {
					
				    this.u_name=value;
		  		  console.log("app value:"+value);
			  });
	  
	  this.storage.get(this.U_EMAIL).then((value) => 
			  {
					
				  this.u_email=value;
		  		  console.log("app value:"+value);
			  });
	  
	this.storage.get(this.U_PROFILEIMG).then((value) => 
			  {
					
				  this.u_img=this.apiValues.baseImageFolder+value;
		  		  console.log("app value:"+value);
			  });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
   
    // navigate to the new page if it is not the current page
    
    if(page.component==null)
    {
      page.hasSub=! page.hasSub;
      return;
    }
     this.menu.close();
    this.nav.setRoot(page.component);
  }

  viewProfile()
  {
      this.menu.close();
      this.nav.setRoot(UserProfilePage);
  }

  hideSearch()
  {
    this.showSearch=false;
    console.log('Hide CLicked');
  }

  searchClient(searchString)
  {
    console.log("Search String:"+searchString);
    let data={

      searchText:searchString
    };

    this.nav.push(SearchHeaderPage,data);
     console.log("Search String:"+searchString);
  }
}
