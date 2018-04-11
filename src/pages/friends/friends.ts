import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialProvider } from "../../providers/social/social";
import { User } from "../../models/social";
import "rxjs/Rx";
import { FormControl } from "@angular/forms";
import { FriendshipProvider } from "../../providers/friendship/friendship";

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage implements OnInit {
  private users: User[];
  private usersSelected: User[];
  private searchControl: FormControl;
  private searchTerm:string;
  private usersRequest: User[];
  private usersSent: User[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialProvider: SocialProvider,
              public friendshipProvider: FriendshipProvider,
              public events: Events) {
    this.searchControl = new FormControl();
    this.searchTerm = '';
    this.users = [];

    this.events.subscribe('request:new', () => {
      this.getRequests();
      this.getRequestsSent();
    });

    this.events.subscribe('request:delete', () => {
      this.getRequests();
      this.getRequestsSent();
    });
  }

  ngOnInit(){
    this.getRequests();
    this.getRequestsSent();
  }

  ionViewWillLeave(){
    this.searchTerm = '';
    this.users = [];
  }

  getUsers(){
    this.socialProvider.getUsers()
      .subscribe(res => {
          this.users = res;
          this.usersSelected = this.users;
        },() =>{},
        ()=>{
          this.users = this.users.sort((a: User, b:User) =>
            parseInt(b.id) - parseInt(a.id)
          );
          this.searchControl.valueChanges.debounceTime(2000).subscribe(search => {
            this.searchUser(this.searchTerm);
          });
        });
  }

  onUser(user: User){
    this.navCtrl.push('UserPage', {"user": user});
  }

  searchUser(realname:string){
    if(realname.length>0) {
      console.log(realname);
      this.socialProvider.search(realname)
        .subscribe(res => {
            this.users = res;
          });
    } else {
      this.users = [];
    }
  }

  getRequests(){
    this.friendshipProvider.getRequests('got-requests')
      .subscribe((res) => {
        this.usersRequest = res;
      })
  }

  getRequestsSent(){
    this.friendshipProvider.getRequests('sent-requests')
      .subscribe((res) => {
        this.usersSent = res;
      })
  }

  acceptFriend(id: string){
    this.friendshipProvider.acceptFriend(id)
      .subscribe(() => {
        this.events.publish('request:marked');
      });
    this.getRequests();
  }

  ignoreFriend(id: string){
    this.friendshipProvider.ignoreFriend(id)
      .subscribe(() =>{
        this.events.publish('request:marked');
      });
    this.getRequests();
  }

  deleteFriend(id: string){
    this.friendshipProvider.cancelRequestFriend(id)
      .subscribe(() =>{
        this.events.publish('request:delete');
      })
  }

  friendsList(){
    this.navCtrl.push('FriendsListPage');
  }
}
