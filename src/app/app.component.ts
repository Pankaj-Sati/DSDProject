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
import { ApiValuesProvider } from '../providers/api-values/api-values';
import { MyStorageProvider } from '../providers/my-storage/my-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LoadingController, ToastController } from 'ionic-angular';
import { User } from '../models/login_user.model';
import { CaseType } from '../models/case_type.model';

import { CaseTypeProvider } from '../providers/case-type/case-type';

import {timer} from 'rxjs/observable/timer';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { Events } from 'ionic-angular';

@Component(
{
    templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild("content") nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage:any =null;
  showSplash=true; //To show custom splash screen

  pages: Array<{ title: string, icon: string, iconColor: string, component: any, subs: Array<{ title: string, icon: string,iconColor:string,component: any}>, hasSub:boolean}>;
  settingPages: Array<{ title: string, icon: string, iconColor: string,component: any}>;
  userPages: Array<{ title: string, icon: string, iconColor: string,component: any}>;
  clientPages: Array<{ title: string, icon: string, iconColor: string,component: any}>;
  smsPages: Array<{ title: string, icon: string, iconColor: string,component: any}>;
  caseStudyPages: Array<{ title: string, icon: string, iconColor: string,component: any}>;
  accountManagementPages: Array<{ title: string, icon: string, iconColor: string,component: any}>;


  loggedInUser: User;

   u_name: string="App User";
   u_email:string;
   u_img: string = "assets/imgs/generic_user.png";

   showSearch:boolean;
   header_title:string;

  constructor(
    public apiValues: ApiValuesProvider,
    public events: Events,
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public myStorage: MyStorageProvider,
    public inAppBrowser: InAppBrowser,
    public caseTypeProvider: CaseTypeProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) 
  {

    this.initializeApp();
    this.getCaseTypeList();
    this.checkIfAlreadyLoggedIn();
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
    this.settingPages = [
      { title: 'User Type', icon: 'bowtie', iconColor:'cadetblue', component: SettingUserTypePage },
      { title: 'Case Type', icon: 'clipboard', iconColor: 'cadetblue',component: SettingCaseTypePage}
      ];

      this.userPages=[
        { title: 'User List', icon: 'contact', iconColor: 'chocolate',component: UserListPage}
      ];

        this.clientPages=[
          { title: 'Client List', icon: 'people', iconColor: 'cornflowerblue', component: ClientListPage},
      ];
        this.smsPages=[

          { title: 'Bulk SMS', icon: 'contact', iconColor: 'darksalmon',component: SMSBulkEmailPage},
          { title: 'SMS List', icon: 'list-box', iconColor: 'darksalmon',component: SMSListPage}
      ];

      this.caseStudyPages=[
        { title: 'Case Study List', icon: 'people', iconColor: 'forestgreen', component: CaseStudyPage},
      ];

      this.accountManagementPages=[
        { title: 'User Account Management', icon: 'people', iconColor: 'darkcyan', component: AccountManagementPage},
        { title: 'Account Management', icon: 'bookmarks', iconColor: 'darkcyan', component: AccountSummaryPage}
      ];

    // set our app's pages
    this.pages = [

      { title: 'Dashboard', icon: 'home', iconColor:'appDashboardIcon', component: DashboardPage, subs: null, hasSub: false },

      { title: 'Settings', icon: 'settings', iconColor:'appSettingIcon', component: null, subs: this.settingPages, hasSub: false },

      { title: 'Users', icon: 'contacts', iconColor:'appUsersIcon', component: null, subs: this.userPages, hasSub: false },

      { title: 'Case Management', icon: 'filing', iconColor:'appCaseIcon', component: null, subs: this.clientPages, hasSub: false },


      { title: 'Account Management', icon: 'archive', iconColor:'appAccountIcon', component: null, subs: this.accountManagementPages, hasSub: false },

      { title: 'SMS', icon: 'send', iconColor:'appSMSIcon', component: null, subs: this.smsPages, hasSub: false },
   

      { title: 'Reminders', icon: 'clock', iconColor:'appRemindersIcon', component: RemindersPage, subs: null, hasSub: false },

      { title: 'Notifications', icon: 'notifications', iconColor:'appNotificationIcon', component: NotificationsPage, subs: null, hasSub: false },

      { title: 'Case Study', icon: 'paper', iconColor:'appCaseStudyIcon', component: null, subs: this.caseStudyPages, hasSub: false },

     //{ title: 'File Test', icon:'paper', component: HelloIonicPage,subs:null,hasSub:false },

      { title: 'Logout', icon: 'log-out', iconColor:'appLogoutIcon', component: LogoutPage, subs: null, hasSub: false }
    
    ];
  }

  getCaseTypeList()
  {
    const loader = this.loadingCtrl.create(
      {
        content: 'Loading...',
        duration:10000
      });
    loader.present();

    let loadingSuccessful = false; //To know whether timeout occured or not
    this.caseTypeProvider.fetchList();

    this.events.subscribe('get_case_types', (success) =>
    {
      
      loadingSuccessful = true;
      loader.dismiss(); //Dismiss the loader whether the result was a success or a failure
    });

    loader.onDidDismiss(() =>
    {
      if (!loadingSuccessful)
      {
        //Timeout
        const toast = this.toastCtrl.create({
          message: 'Timeout!!! Server Did Not Respond',
          duration:3000
        });
        toast.present();
      }
    });


  }

  checkIfAlreadyLoggedIn()
  {
    if (this.loggedInUser != undefined && this.loggedInUser != null && this.loggedInUser.id.length > 0)
    {
        this.rootPage=DashboardPage;     
    }
      else
    {
      console.log("nav");
      console.log(this.nav);
      this.rootPage=LoginPage;
      
      }
        
      
  }

  initializeApp() 
  {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log("Platform is ready");

      timer(3000).subscribe(()=>this.showSplash = false);
    });


    this.loggedInUser = this.myStorage.getParameters();
    if (this.loggedInUser != undefined || this.loggedInUser != null)
    {
      this.u_name = this.loggedInUser.name;
      this.u_email = this.loggedInUser.email;
      this.u_img = this.apiValues.baseImageFolder + this.loggedInUser.profile_img;
    }
    
		  		  
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

  openLink()
  {
    let target = "_system";
    this.inAppBrowser.create("https://www.mazetechnologiesllc.com/", target);

  }

}
