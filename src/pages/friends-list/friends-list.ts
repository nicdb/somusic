import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/social";
import { FriendshipProvider } from "../../providers/friendship/friendship";

@IonicPage()
@Component({
  selector: 'page-friends-list',
  templateUrl: 'friends-list.html',
})
export class FriendsListPage {
  private users: User[];
  private dataAv: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public friendsProvider: FriendshipProvider) {
    this.users = [];
    this.dataAv = false;
  }

  ngOnInit(){
    this.getUsers();
  }

  getUsers(){
    this.friendsProvider.getFriends()
      .subscribe(users => {
          this.users = users;
          this.dataAv = true;
        });
  }
}
