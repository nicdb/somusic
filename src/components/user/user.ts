import { Component, Input, OnInit } from '@angular/core';
import { User } from "../../models/social";
import { FriendshipProvider } from "../../providers/friendship/friendship";
import { Events, NavController, NavParams } from "ionic-angular";

import { Storage } from '@ionic/storage';
import { GroupsProvider}  from "../../providers/groups/groups";


@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent implements OnInit{
  @Input("user") user: User;
  @Input("isInvite") isInvite: boolean;
  @Input("groupId") groupId: string;
  private buttonString: string;
  private isFriends: boolean;
  private isUser: boolean;
  private datav: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public friendshipProvider: FriendshipProvider,
              public storage: Storage,
              public events: Events,
              public groupProvider: GroupsProvider) {
    this.datav = false;
    this.isUser = false;
  }

  ngOnInit(){
    this.isFriend();
    this.getUser();
  }

  isFriend(){
    this.friendshipProvider.isFriend(this.user.id)
      .subscribe(res =>{
        console.log(res.status);
        if(res.status.includes("pending")) {
          this.buttonString = "Pending";
          this.isFriends = false;
        } else if (res.status.includes("notFriends")) {
          this.buttonString = "Add Friend";
          this.isFriends = false;
        } else {
          this.buttonString = "Unfriend";
          this.isFriends = true;
        }
        this.datav = true;
      })
  }

  manageFriend(){
    if(!this.isFriends) {
      this.storage.get("userID")
        .then(userID =>
          this.friendshipProvider.addFriend(userID, this.user.id)
            .subscribe(
              ( ) =>{
                this.events.publish('request:new');
                this.isFriend();
              }))
    } else {
      this.friendshipProvider.deleteFriend(this.user.id)
        .subscribe(
          () =>{
            this.events.publish('request:delete');
            this.isFriend();
          })
    }
  }

  getUser(){
    this.storage.get("userID")
      .then(userID => {
        this.isUser = userID == this.user.id;
      });
  }

  onUser(user:User){
    this.navCtrl.push('UserPage', {"user": user});
  }

  invite(){
    this.groupProvider.invite(this.groupId, this.user.id)
      .subscribe(
        () => {
          this.events.publish('invite:sent');
        });
  }
}
