import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { BrMaskerModule, BrMaskerIonic3 } from 'brmasker-ionic-3';
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
import { ViewProfilePage } from '../pages/user_profile/view_profile/view_profile';
import { ChangePasswordPage } from '../pages/user_profile/change_password/change_password';
import { SingleUserPage } from '../pages/user_list/single_user/single_user';
import { ChangeUserPasswordPage } from '../pages/user_list/change_user_password/change_user_password';
import { UpdateUserPage } from '../pages/user_list/update_user/update_user';
import { ClientListPage } from '../pages/client_list/client_list';
import { AddClientPage } from '../pages/client_list/add_client/add_client';
import { SingleClientPage } from '../pages/client_list/single_client/single_client';
import { SingleClientModule } from '../pages/client_list/single_client/single_client.module';
import { ChangeManagerPage } from '../pages/client_list/single_client/change_manager/change_manager';
import { SendSMSPage } from '../pages/client_list/single_client/send_sms/send_sms';

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
import { SMSListPage } from '../pages/sms/smslist/smslist';
import {SingleUserAccountPage} from '../pages/account_management/single_user_account/single_user_account';
import { SearchHeaderPageModule } from '../pages/search-header/search-header.module';
import { BookAppointmentPageModule } from '../pages/book-appointment/book-appointment.module';
import { AppointmentListPageModule } from '../pages/appointment-list/appointment-list.module';
import { BookAppointmentAtLoginPageModule } from '../pages/book-appointment-at-login/book-appointment-at-login.module';


import { ComponentsModule } from '../components/components.module';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule} from '@angular/http';
import { MyStorageProvider } from '../providers/my-storage/my-storage';
import { IonicStorageModule } from '@ionic/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { AdvocateListProvider } from '../providers/advocate-list/advocate-list';
import { ApiValuesProvider } from '../providers/api-values/api-values';
import { ClientEntityRelationshipProvider } from '../providers/client-entity-relationship/client-entity-relationship';
import { CountryProvider } from '../providers/country/country';
import { CaseTypeProvider } from '../providers/case-type/case-type';
import { Chooser } from '@ionic-native/chooser';
import { SignUpPageModule} from '../pages/sign-up/sign-up.module';
import { NotificationsModule } from '../pages/notifications/new_format/notification.module';
import { RemindersModule } from '../pages/reminders/new_format/reminders.module';
import { ForgotPasswordPageModule } from '../pages/forgot-password/forgot-password.module';
import { EntityTypeProvider } from '../providers/entity-type/entity-type';
import { StateListProvider } from '../providers/state-list/state-list';
import { PipesModule } from '../pipes/pipes.module';
import { CommonCalendarPageModule } from '../pages/common-calendar/common-calendar.module';
import { UserTypesProvider } from '../providers/user-types/user-types';
import { FrontPage } from '../pages/front/front';
import { FrontPageModule } from '../pages/front/front.module';
import { MediaPageModule } from '../pages/media/media.module';
import { ContactUsPageModule } from '../pages/contact-us/contact-us.module';
import { HomePageModule } from '../pages/home/home.module';
import { ImagePicker } from '@ionic-native/image-picker';
import { AppAvailability } from '@ionic-native/app-availability';



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
    ViewProfilePage,
    ChangePasswordPage,
    SingleUserPage,
    ChangeUserPasswordPage,
    UpdateUserPage,
    ClientListPage,
    AddClientPage,
    //SingleClientPage,
   // ChangeManagerPage,
    //SendSMSPage,
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
    ComponentsModule,
    BrMaskerModule,
    SingleClientModule,
    NotificationsModule,
    SignUpPageModule,
    RemindersModule,
    ForgotPasswordPageModule,
    BookAppointmentPageModule,
    AppointmentListPageModule,
    BookAppointmentAtLoginPageModule,
    PipesModule,
    CommonCalendarPageModule,
    FrontPageModule,
    MediaPageModule,
    ContactUsPageModule,
    HomePageModule
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
    ViewProfilePage,
    //SingleClientPage,
    //ChangeManagerPage,
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
    SMSListPage,
    //SendSMSPage
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
    FilePath,
    WebView,
    InAppBrowser,
    ClientEntityRelationshipProvider,
    CountryProvider,
    CaseTypeProvider,
    Chooser,
    EntityTypeProvider,
    StateListProvider,
    UserTypesProvider,
    ImagePicker,
    Crop,
    AppAvailability
  ],
  exports: [ComponentsModule, PipesModule],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
