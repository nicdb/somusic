import { Component, OnInit } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from "../../providers/auth/auth";
import { GroupsProvider } from "../../providers/groups/groups";
import { Group } from "../../models/group";
import { User } from "../../models/social";
import { SocialProvider } from "../../providers/social/social";
import {fromPromise} from "rxjs/observable/fromPromise";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage implements OnInit{
  public groups: Group[];
  public adminGroups: Group[];
  public joinedGroups: Group[];
  public invites: Group[];
  public user: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public socialProvider: SocialProvider,
              public storage: Storage,
              public app: App,
              public groupProvider: GroupsProvider,
              public events: Events,
              public alertCtrl: AlertController) {
    this.adminGroups = [];
    this.joinedGroups = [];
    this.invites = [];
    this.user = null;

    this.events.subscribe('group:new', () => {
      this.getAdminGroups();
    });

    this.events.subscribe('group:join', () => {
      this.getJoinedGroups();
    });

    this.events.subscribe('group:leave', () => {
      this.getJoinedGroups();
    });

    this.events.subscribe('group:delete', () => {
      this.getAdminGroups();
    });

    this.events.subscribe('invite:new', () => {
      this.getInvites();
    });
  }

  ngOnInit(){
    this.getAdminGroups();
    this.getJoinedGroups();
    this.getInvites();
    this.getUser();
  }

  newGroup(){
    this.navCtrl.push('NewGroupPage');
  }

  logout(){
    this.storage.get("token")
      .then(token => {
        this.authProvider.logout(token)
          .subscribe(() => {
            this.storage.clear();
            this.app.getRootNav().setRoot('WelcomePage');
            this.navCtrl.popToRoot();
          })
      })
  }

  getGroups(){
    this.groupProvider.getGroups()
      .subscribe(res => {
          this.groups = res;
        });
  }

  getUser(){
    this.storage.get("userID")
      .then( userId => {
        this.socialProvider.getUserById(userId)
          .subscribe(
            user => this.user = user
          )
      });
  }

  getJoinedGroups(){
    this.groupProvider.getPersonalUserGroups()
      .subscribe(res => {
          this.joinedGroups = res;
        });
  }

  getAdminGroups(){
    this.groupProvider.getPersonalAdminGroups()
      .subscribe(res => {
          this.adminGroups = res;
        });
  }

  getInvites(){
    this.groupProvider.inviteList()
      .subscribe(res => {
        this.invites = res;
      })
  }

  onGroup(group:Group){
    this.navCtrl.push('GroupPage', {"group": group});
  }

  joinGroup(group: Group){
    this.groupProvider.joinGroup(group.id)
      .subscribe(() => {
        this.getGroups();
        this.getInvites();
        this.events.publish("invite:mark");
        this.events.publish("group:join");
      }, () =>{},
        ()=>{
          this.navCtrl.push('GroupPage', {"group": group});
        });
  }

  leaveGroup(groupId: string){
    this.groupProvider.leaveGroup(groupId)
      .subscribe(() => {
        this.events.publish("group:leave");
        this.getGroups();
      })
  }

  deleteGroup(groupId: string){
    this.groupProvider.deleteGroup(groupId)
      .subscribe(() => {
        this.events.publish("group:delete");
        this.getAdminGroups();
      })
  }

  declineInvite(groupId: string){
    this.groupProvider.decline(groupId)
      .subscribe(() => {
        this.getGroups();
        this.getInvites();
        this.events.publish("invite:mark");
      })
  }

  searchGroup(){
    this.navCtrl.push('GroupsPage');
  }

  onProfile(){
    this.navCtrl.push('UserPage', {"user": this.user});
  }

  presentConfirmDelete(groupId: string) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete this group?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteGroup(groupId);
          }
        }
      ]
    });
    alert.present();
  }

  presentConfirmLeave(groupId: string) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to leave this group?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Leave',
          handler: () => {
            this.leaveGroup(groupId);
          }
        }
      ]
    });
    alert.present();
  }
}
