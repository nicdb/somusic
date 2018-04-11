import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { Push } from "@ionic-native/push";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicSwipeAllModule } from 'ionic-swipe-all';
import { Network } from '@ionic-native/network';

import { AuthProvider } from "../providers/auth/auth";
import { InstrumentProvider } from "../providers/instrument/instrument";
import { CompositionProvider } from "../providers/composition/composition";
import { EditorProvider } from "../providers/editor/editor";
import { SocialProvider } from "../providers/social/social";
import { FriendshipProvider } from "../providers/friendship/friendship";
import { GroupsProvider } from "../providers/groups/groups";
import { NotificationProvider } from "../providers/notifications/notifications";
import { AssignmentProvider } from "../providers/assignment/assignment";
import { ConfigProvider } from '../providers/config/config';
import { TokenInterceptor } from "../providers/token-interceptor/token.interceptor";

import {ComponentsModule} from "../components/components.module";
import {DirectivesModule} from "../directives/directives.module";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    DirectivesModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      platforms: {
        android: {
          tabsPlacement: 'top'
        },
        ios: {
          tabsPlacement: 'bottom'
        }
      }
    }),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicSwipeAllModule
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthProvider,
    InstrumentProvider,
    CompositionProvider,
    EditorProvider,
    SocialProvider,
    AssignmentProvider,
    FriendshipProvider,
    GroupsProvider,
    NotificationProvider,
    Push,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    ConfigProvider,
    InAppBrowser,
    Network
  ]
})
export class AppModule {}
