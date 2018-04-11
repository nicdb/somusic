import { Component, OnInit } from '@angular/core';

import { AlertController, Events, IonicPage, NavController, Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AuthProvider } from "../../providers/auth/auth";
import { NotificationProvider } from "../../providers/notifications/notifications";
import { FriendshipProvider } from "../../providers/friendship/friendship";
import { GroupsProvider } from "../../providers/groups/groups";
import {ConfigProvider} from "../../providers/config/config";

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit{
  tabHome = 'HomePage';
  tabCompositions = 'CompositionsPage';
  tabFriends = 'FriendsPage';
  tabNotifications = 'NotificationsPage';
  tabSettings = 'SettingsPage';
  length: number = 0;
  lengthRequests: number = 0;
  lengthInvites: number = 0;
  isAndroid: boolean = false;

  constructor(public platform: Platform,
              public push: Push,
              public auth: AuthProvider,
              public navCtrl: NavController,
              public toast: ToastController,
              public notificationProvider: NotificationProvider,
              public friendshipProvider: FriendshipProvider,
              public groupsProvider: GroupsProvider,
              public config: ConfigProvider,
              public storage: Storage,
              public events: Events,
              public alert: AlertController) {
    this.isAndroid = platform.is("android") || platform.is("core");

    events.subscribe('notification:marked', () => {
      this.length = 0;
    });
    events.subscribe('request:marked', () => {
      this.getFriendRequestLength();
    });

    events.subscribe('invite:mark', () => {
      this.getInvites();
    });

    /**this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
          this.initPush();
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });*/
  }

  ngOnInit(){
    this.getNotificationLength();
    this.getFriendRequestLength();
    this.getInvites();
  }

  initPush(){
    const options: PushOptions = {
      android: {
        senderID: this.config.senderId
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: this.config.pushServiceUrl
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification')
      .subscribe((data: any) => {
        console.log('message -> ' + data.message);
        if (data.additionalData.foreground) {
          if (data.title.includes('Friend request')) {
            this.getFriendRequestLength();
            this.events.publish('request:new');
            let confirmToast = this.toast.create({
              message: data.message,
              duration: 3000,
              position: 'top'
            });
            confirmToast.present();
          } else if (data.title.includes('invites')){
            this.getInvites();
            this.events.publish('invite:new');
            let confirmToast = this.toast.create({
              message: data.message,
              duration: 3000,
              position: 'top'
            });
            confirmToast.present();
          } else {
            this.getNotificationLength();
            this.events.publish('notification:new');

            let confirmToast = this.toast.create({
              message: data.message,
              duration: 3000,
              position: 'top'
            });
            confirmToast.present();
          }
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          this.navCtrl.push('NotificationsPage');
          console.log('Push notification clicked');
        }
      });

    pushObject.on('registration')
      .subscribe((data: any) => {

        this.auth.registrationToken(data.registrationId)
          .subscribe(res =>{},
            ()=>{},
            ()=>{
            })
      });

    pushObject.on('error')
      .subscribe(error => console.error('Error with Push plugin', error));
  }

  getNotificationLength(){
    this.storage.get("userID")
      .then(id => {
        this.notificationProvider.getNotifications(id)
          .subscribe((res)=>{
            if(res === null)
              this.length = 0;
            else
              this.length = res.length;
          })
      });
  }

  getFriendRequestLength(){
    this.storage.get("userID")
      .then(id => {
        this.friendshipProvider.getRequests('got-requests')
          .subscribe((res) => {
            if(res === null)
              this.lengthRequests = 0;
            else
              this.lengthRequests = res.length;
          })
      });
  }

  getInvites(){
    this.groupsProvider.inviteList()
      .subscribe(res => this.lengthInvites = res.length)
  }
}
