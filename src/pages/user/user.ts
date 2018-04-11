import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post, User } from "../../models/social";
import { SocialProvider } from "../../providers/social/social";
import { FriendshipProvider } from "../../providers/friendship/friendship";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  private user: User;
  private posts: Post[];
  private buttonString: string;
  private isFriends: boolean;
  private isUser: boolean;
  private datav: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialProvider: SocialProvider,
              public friendshipProvider: FriendshipProvider,
              public storage: Storage,
              public events: Events) {
    this.user = this.navParams.get("user");
    this.isUser = false;
    this.datav = false;

    this.events.subscribe('post:deleted', () => {
      this.getPosts();
    });
  }

  ngOnInit (){
    this.getPosts();
    this.isFriend();
    this.getUser();
  }

  isFriend(){
    this.friendshipProvider.isFriend(this.user.id)
      .subscribe(res => {
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

  getUser(){
    this.storage.get("userID")
      .then(userID => {
        this.isUser = userID == this.user.id;
      });
  }

  manageFriend(){
    if(!this.isFriends) {
      this.storage.get("userID")
        .then(userID =>
          this.friendshipProvider.addFriend(userID, this.user.id)
            .subscribe(
              () =>{
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

  getPosts(){
    this.socialProvider.getUserPosts(Number(this.user.id))
      .subscribe(res => {
          this.posts = res;
        },() =>{},
        ()=>{
          this.posts = this.posts.sort((a:Post, b:Post) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });
  }
}
