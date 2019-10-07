import { Component, ViewChild } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Platform, MenuController, Nav} from 'ionic-angular';

//Pages
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { FrontPage } from '../pages/front/front';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ReminderListPage } from '../pages/reminders/new_format/reminder_list/reminder_list';
import { NotificationListPage } from '../pages/notifications/new_format/notification_list/notification_list';
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
import { SMSListPage } from '../pages/sms/smslist/smslist';
import { SingleClientPage } from '../pages/client_list/single_client/single_client';
import { AppointmentListPage } from '../pages/appointment-list/appointment-list';
import { EditProfilePage } from '../pages/user_profile/edit_profile/edit_profile';
import { ClientDocumentsPage } from '../pages/client_list/single_client/document/document';
import { CommonCalendarPage } from '../pages/common-calendar/common-calendar';
import { ChangePasswordPage } from '../pages/user_profile/change_password/change_password';

import {SearchHeaderPage} from '../pages/search-header/search-header';
import { ApiValuesProvider } from '../providers/api-values/api-values';
import { MyStorageProvider } from '../providers/my-storage/my-storage';
import { StateListProvider } from '../providers/state-list/state-list';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import { User } from '../models/login_user.model';
import { Client } from '../models/client.model';
import { CaseType } from '../models/case_type.model';

import { CaseTypeProvider } from '../providers/case-type/case-type';
import { UserTypesProvider } from '../providers/user-types/user-types';

import {timer} from 'rxjs/observable/timer';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { Events } from 'ionic-angular';
import { HomePage } from '../pages/home/home';

@Component(
  {
    selector:'page-main',
    templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild("content") nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage:any =null;
  showSplash=false; //To show custom splash screen

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
  header_title: string;

  exitApp = false; //For exiting app when back button is pressed twice in 5 seconds delay

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
    public toastCtrl: ToastController,
    public stateListProvider: StateListProvider,
    public alertCtrl: AlertController,
    public http: Http,
    public userTypesProvider: UserTypesProvider
  ) 
  {

    this.initializeApp();
    this.getCaseTypeList();
    this.getStateList();
    this.getUserTypeList();
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

    events.subscribe('getStateList', (data) =>
    {
      //This event can be used to get the state list if it is not found
      this.getStateList();
    });

    events.subscribe('getUserTypeList', (data) =>
    {
      //This event can be used to get the user type list if it is not found
      this.getUserTypeList();
    });

    //Emulating Back button callback

    this.platform.registerBackButtonAction(() =>
    {
      console.log('Back Button Pressed');
      if (! this.nav.canGoBack())
      {
        //If there are no other pages in the navigation stack, and user presses back button, we will ask him to press it again to exit

        if (this.exitApp==false)
        {
          this.presentToast('Press back again to exit');
          this.exitApp = true;
        }
        else
        {
          //Exit is true and user has again pressed back button, so we will exit;

          this.platform.exitApp();
        }
        

        timer(5000).subscribe(success =>
        {
          this.exitApp = false; //Set back to false if user does not press back button twice
        });
      }
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

    /*
     * Currently Hardcoding Access Mechanism for client only 
     * */

    this.giveAccessToMenus();
   
    
  }

  giveAccessToMenus()
  {
    
    console.log('LoggedIn User=' + this.loggedInUser);
    console.log(this.loggedInUser);

    if (this.loggedInUser && Number(this.loggedInUser.user_type_id) == 5)
    {
      //ID 5 is for client
      console.log('-In if LoggedIn USer-');

      this.clientPages = [
        { title: 'Client Details', icon: 'people', iconColor: 'cornflowerblue', component: SingleClientPage },
      ];

      this.pages = [

        { title: 'Home', icon: 'home', iconColor: 'appDashboardIcon', component: HomePage, subs: null, hasSub: false },

        // { title: 'Settings', icon: 'settings', iconColor: 'appSettingIcon', component: null, subs: this.settingPages, hasSub: false },

        // { title: 'Users', icon: 'contacts', iconColor: 'appUsersIcon', component: null, subs: this.userPages, hasSub: false },

      //  { title: 'Case Management', icon: 'filing', iconColor: 'appCaseIcon', component: null, subs: this.clientPages, hasSub: false },

        { title: 'Edit Profile', icon: 'people', iconColor: 'appCaseIcon', component: EditProfilePage, subs: null, hasSub: false },

        { title: 'Change Password', icon: 'finger-print', iconColor: 'appChangePassword', component: ChangePasswordPage, subs: null, hasSub: false },


        // { title: 'Account Management', icon: 'archive', iconColor: 'appAccountIcon', component: null, subs: this.accountManagementPages, hasSub: false },

        //  { title: 'SMS', icon: 'send', iconColor: 'appSMSIcon', component: null, subs: this.smsPages, hasSub: false },


        { title: 'Reminders', icon: 'clock', iconColor: 'appRemindersIcon', component: ReminderListPage, subs: null, hasSub: false },

        { title: 'Notifications', icon: 'notifications', iconColor: 'appNotificationIcon', component: NotificationListPage, subs: null, hasSub: false },

        { title: 'Appointments', icon: 'bookmark', iconColor: 'appAppointmentIcon', component: AppointmentListPage, subs: null, hasSub: false },

        { title: 'My Documents', icon: 'document', iconColor: 'appDocumentsIcon', component: ClientDocumentsPage, subs: null, hasSub: false },

       // { title: 'Case Study', icon: 'paper', iconColor: 'appCaseStudyIcon', component: null, subs: this.caseStudyPages, hasSub: false },

        //{ title: 'File Test', icon:'paper', component: HelloIonicPage,subs:null,hasSub:false },

        { title: 'Delete Profile', icon: 'trash', iconColor: 'appLogoutIcon', component: 'delete_profile', subs: null, hasSub: false },

        { title: 'Logout', icon: 'log-out', iconColor: 'appLogoutIcon', component: LogoutPage, subs: null, hasSub: false }

      ];

    }
    else
    {
      this.clientPages = [
        { title: 'Client List', icon: 'people', iconColor: 'cornflowerblue', component: ClientListPage },
      ];
      console.log('-In else LoggedIn USer-');
      // set our app's pages granting access to every module
      this.pages = [

        { title: 'Home', icon: 'home', iconColor: 'appDashboardIcon', component: HomePage, subs: null, hasSub: false },

        //{ title: 'Settings', icon: 'settings', iconColor: 'appSettingIcon', component: null, subs: this.settingPages, hasSub: false },

        { title: 'Users', icon: 'contacts', iconColor: 'appUsersIcon', component: null, subs: this.userPages, hasSub: false },

        { title: 'Case Management', icon: 'filing', iconColor: 'appCaseIcon', component: null, subs: this.clientPages, hasSub: false },


        { title: 'Account Management', icon: 'archive', iconColor: 'appAccountIcon', component: null, subs: this.accountManagementPages, hasSub: false },

        { title: 'SMS', icon: 'send', iconColor: 'appSMSIcon', component: null, subs: this.smsPages, hasSub: false },

        { title: 'Calendar', icon: 'calendar', iconColor: 'appCalendarIcon', component: CommonCalendarPage, subs: null, hasSub: false },


        { title: 'Reminders', icon: 'clock', iconColor: 'appRemindersIcon', component: ReminderListPage, subs: null, hasSub: false },

        { title: 'Notifications', icon: 'notifications', iconColor: 'appNotificationIcon', component: NotificationListPage, subs: null, hasSub: false },

        { title: 'Appointments', icon: 'bookmark', iconColor: 'appAppointmentIcon', component: AppointmentListPage, subs: null, hasSub: false },

        { title: 'Case Study', icon: 'paper', iconColor: 'appCaseStudyIcon', component: null, subs: this.caseStudyPages, hasSub: false },

        //{ title: 'File Test', icon: 'paper', iconColor:'#782424', component: HelloIonicPage, subs: null, hasSub: false },
        { title: 'Delete Profile', icon: 'trash', iconColor: 'appLogoutIcon', component: 'delete_profile', subs: null, hasSub: false },

        { title: 'Logout', icon: 'log-out', iconColor: 'appLogoutIcon', component: LogoutPage, subs: null, hasSub: false }

      ];
    }
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

  getStateList()
  {
    const loader = this.loadingCtrl.create(
      {
        content: 'Loading...',
        duration: 10000
      });
    loader.present();

    let loadingSuccessful = false; //To know whether timeout occured or not
    this.stateListProvider.fetchList();

    this.events.subscribe('get_states', (result) =>
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
          duration: 3000
        });
        toast.present();
      }
    });


  }

  getUserTypeList()
  {
    const loader = this.loadingCtrl.create(
      {
        content: 'Loading...',
        duration: 10000
      });
    loader.present();

    let loadingSuccessful = false; //To know whether timeout occured or not
    this.userTypesProvider.fetchList();

    this.events.subscribe('user_type_list_event', (result) =>
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
          duration: 3000
        });
        toast.present();
      }
    });


  }

  checkIfAlreadyLoggedIn()
  {
    if (this.loggedInUser != undefined && this.loggedInUser != null && this.loggedInUser.id.length > 0)
    {
      this.rootPage = HomePage;     
    }
      else
    {
      console.log("nav");
      console.log(this.nav);
      this.rootPage=FrontPage;
      
      }
        
      
  }

  initializeApp() 
  {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();
      console.log("Platform is ready");

      /*
       * Timer for splash screen
      timer(3000).subscribe(()=>this.showSplash = false);
      */
    });

    this.platform.pause.subscribe(() =>
    {
      console.log('App Paused');
      //If the user is logged-in, we will store the current time at which the app is paused i.e. not in foreground
      if (this.loggedInUser != undefined && this.loggedInUser != null && this.loggedInUser.id != undefined)
      {
        this.myStorage.setLastUsed(new Date().getTime()); //Current time
      }
    });

    this.platform.resume.subscribe(() =>
    {
      console.log('App Resumed');

      //When user resumes the app, we will see if the time is more than set time like 10 minutes, we will redirect user to home screen
      if (this.loggedInUser != undefined && this.loggedInUser != null && this.loggedInUser.id != undefined)
      {
        let currentTimeInMilli = new Date().getTime();
        let lastUsedTimeInMilli = this.myStorage.getLastUsed();
        if (Number(currentTimeInMilli-lastUsedTimeInMilli) >= this.apiValues.APP_RELOAD_TIME)
        {
          console.log('Paused Time:'+Number(currentTimeInMilli - lastUsedTimeInMilli));
          this.nav.setRoot(DashboardPage);
        }
      }
      
    
    });
    this.loggedInUser = this.myStorage.getParameters();
    this.giveAccessToMenus();

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

    if (page.component == SingleClientPage)
    {
      //Currently harcoding access right to a usertype= Client
      let client: Client = new Client();
      client.id = Number(this.loggedInUser.id);
      let data =
      {
        clientPassed: client
      };
      this.nav.setRoot(SingleClientPage, data);
      return;
    }

    if (page.component == EditProfilePage)
    {
      let data =
      {
        user_id: this.loggedInUser.id
      };
      this.nav.setRoot(EditProfilePage, data);
      return;
    }

    if (page.component == ClientDocumentsPage)
    {
      let data =
      {
        client_id: this.loggedInUser.id,
        client_name: this.loggedInUser.name
      };
      this.nav.setRoot(ClientDocumentsPage, data);
      return;
    }

    if (page.component == 'delete_profile')
    {
      if (Number(this.loggedInUser.user_type_id) == 1 || Number(this.loggedInUser.user_type_id) == 2)
      {
        this.presentAlert('Admin profile can\'t be deleted');
        return;
      }
      this.deleteUser();
      return;
    }

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

  deleteUser()
  {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete!!!',
      message: 'Are you sure that you want to delete your profile?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () =>
          {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () =>
          {
            console.log('Buy clicked');

            this.sendDeleteUserRequest();

          }
        }
      ]
    });
    alert.present()
  }

  sendDeleteUserRequest()
  {
    var headers = new Headers();

    let options = new RequestOptions({ headers: headers });



    let data = new FormData();

    data.set('rowID', this.loggedInUser.id);
    data.set('session_id', this.loggedInUser.id);


    let loader = this.loadingCtrl.create({

      content: "Deleting profile...",

    });

    loader.present().then(() => 
    {

      this.http.post(this.apiValues.baseURL + "/user_delete.php", data, options) //Http request returns an observable

        .map(response => response.json()) ////To make it easy to read from observable

        .subscribe(serverReply =>  //We subscribe to the observable and do whatever we want when we get the data

        {
          console.log(serverReply);
          loader.dismiss();

          if ('message' in serverReply) //incorrect
          {

            const toast = this.toastCtrl.create({
              message: serverReply.message,
              duration: 5000
            });
            toast.present();
          }

          if ('code' in serverReply && serverReply.code == 200)
          {
            //Successfully deleted
            this.myStorage.removeParameters(); //Remove all the user data
            this.nav.setRoot(LoginPage); //Pop the current page from the stack
          }

        });

    });
  }

  presentAlert(msg)
  {
    const alert = this.alertCtrl.create({
      message: msg,
      title: 'Attention',
      buttons: [{
        text:'Ok'
      }]
    });

    alert.present();
  }

  presentToast(msg)
  {
    const toast = this.toastCtrl.create(
      {
        message: msg,
        duration:3000
      });

    toast.present();
  }

}
