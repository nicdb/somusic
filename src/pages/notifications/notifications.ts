import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Notification } from "../../models/social";
import { NotificationProvider } from "../../providers/notifications/notifications";


@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage implements OnInit{
  private ids: string[];
  private notifications: Notification[];
  private notificationsViewed: Notification[];
  private loading = this.loadingCtrl.create({
    content: 'Loading'
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public notificationProvider: NotificationProvider,
              public events: Events,
              public loadingCtrl: LoadingController) {
    this.ids = [];
    this.notifications = [];
    this.notificationsViewed = [];
    events.subscribe('notification:new', () => {
      this.getNotifications();
    });
  }

  ngOnInit(){
    this.loading.present();
    this.getNotifications();
    this.getViewedNotifications();
    this.loading.dismiss();
  }

  ionViewWillLeave(){
    this.markNotifications();
  }

  getNotifications(){
    this.storage.get("userID")
      .then(id => {
        this.notificationProvider.getNotifications(id)
          .subscribe((notifications) => {
            this.notifications = notifications;
        });
      });
  }

  getViewedNotifications(){
    this.storage.get("userID")
      .then(id => {
        this.notificationProvider.getViewedNotification(id)
          .subscribe((notifications) => {
            this.notificationsViewed = notifications;
          });
      });
  }

  markNotifications(){
    for (let notification of this.notifications){
      this.ids.push(notification.notificationId)
    }
    this.notificationProvider.markNotification(this.ids)
      .subscribe(()=> {
        this.events.publish("notification:marked");
        this.notifications = [];
        this.ids = [];
        this.getViewedNotifications();
      });
  }
}
