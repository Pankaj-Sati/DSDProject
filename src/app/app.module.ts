import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import {FilePath} from '@ionic-native/file-path';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { RemindersPage } from '../pages/reminders/reminders';
import { LogoutPage } from '../pages/logout/logout';
import { NotificationsPage } from '../pages/notifications/notifications';
import { AddUserPage } from '../pages/add_user/add_user';
import { UserListPage } from '../pages/user_list/user_list';
import { UserProfilePage } from '../pages/user_profile/user_profile';
import { EditProfilePage } from '../pages/user_profile/edit_profile/edit_profile';
import { ChangePasswordPage } from '../pages/user_profile/change_password/change_password';
import { SingleUserPage } from '../pages/user_list/single_user/single_user';
import { ChangeUserPasswordPage } from '../pages/user_list/change_user_password/change_user_password';
import { UpdateUserPage } from '../pages/user_list/update_user/update_user';
import { ClientListPage } from '../pages/client_list/client_list';
import { AddClientPage } from '../pages/client_list/add_client/add_client';
import { SingleClientPage } from '../pages/client_list/single_client/single_client';
import { ChangeManagerPage } from '../pages/client_list/single_client/change_manager/change_manager';
import { AccountManagementPage } from '../pages/account_management/account_management';
import { AccountSummaryPage } from '../pages/account_management/account_summary/account_summary';
import { PaymentSummaryPage } from '../pages/account_management/single_user_account/payment_summary/payment_summary';
import { PaymentAccountManagementPage } from '../pages/account_management/single_user_account/payment/payment';
import { SendSMSAccountManagementPage } from '../pages/account_management/single_user_account/send_sms/send_sms';
import{CaseStudyPage} from '../pages/case_study/case_study';
import{SingleCaseStudyPage} from '../pages/case_study/single_case_study/single_case_study';
import {SettingUserTypePage} from '../pages/settings/user_type/usertype';
import {SettingCaseTypePage} from '../pages/settings/casetype/casetype';
import {SMSBulkEmailPage} from '../pages/sms/bulkemail/bulkemail';
import {SMSListPage} from '../pages/sms/smslist/smslist';
import {SingleUserAccountPage} from '../pages/account_management/single_user_account/single_user_account';
import {SearchHeaderPageModule} from '../pages/search-header/search-header.module';
import {ComponentsModule} from '../components/components.module';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule} from '@angular/http';
import { MyStorageProvider } from '../providers/my-storage/my-storage';
import { IonicStorageModule } from '@ionic/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { AdvocateListProvider } from '../providers/advocate-list/advocate-list';
import { ApiValuesProvider } from '../providers/api-values/api-values';


@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
	  LoginPage,
	  DashboardPage,
	  RemindersPage,
	  NotificationsPage,
	  LogoutPage,
	  AddUserPage,
    UserListPage,
    UserProfilePage,
    EditProfilePage,
    ChangePasswordPage,
    SingleUserPage,
    ChangeUserPasswordPage,
    UpdateUserPage,
    ClientListPage,
    AddClientPage,
    SingleClientPage,
    ChangeManagerPage,
    AccountManagementPage,
    AccountSummaryPage,
    SingleUserAccountPage,
    PaymentSummaryPage,
    PaymentAccountManagementPage,
    SendSMSAccountManagementPage,
    CaseStudyPage,
    SingleCaseStudyPage,
    SettingUserTypePage,
    SettingCaseTypePage,
    SMSBulkEmailPage,
    SMSListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
	  HttpModule,
        ReactiveFormsModule,
	     IonicStorageModule.forRoot(),
         SearchHeaderPageModule,
         ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
	  LoginPage,
	  DashboardPage,
	   RemindersPage,
	  NotificationsPage,
	  LogoutPage,
	  AddUserPage,
    UserListPage,
    UserProfilePage,
    EditProfilePage,
    ChangePasswordPage,
    SingleUserPage,
    ChangeUserPasswordPage,
    UpdateUserPage,
    ClientListPage,
    AddClientPage,
    SingleClientPage,
    ChangeManagerPage,
    AccountManagementPage,
    AccountSummaryPage,
    SingleUserAccountPage,
    PaymentSummaryPage,
    PaymentAccountManagementPage,
    SendSMSAccountManagementPage,
    CaseStudyPage,
    SingleCaseStudyPage,
    SettingUserTypePage,
    SettingCaseTypePage,
    SMSBulkEmailPage,
    SMSListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MyStorageProvider,
	  IonicStorageModule,
    AdvocateListProvider,
    Camera,
      FileTransfer,
    ApiValuesProvider,
    File,
    FilePath
  ],
  exports: [ComponentsModule]
})
export class AppModule {}
