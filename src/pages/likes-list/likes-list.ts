import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Like, User } from "../../models/social";
import { SocialProvider } from "../../providers/social/social";

@IonicPage()
@Component({
  selector: 'page-likes-list',
  templateUrl: 'likes-list.html',
})
export class LikesListPage implements OnInit{
  private likes: Like[];
  private users: User[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialProvider: SocialProvider) {
    this.likes = this.navParams.get("likes");
    this.users = [];
  }

  ngOnInit(){
    for (let like of this.likes){
      this.socialProvider.getUserById(like.userId)
        .subscribe(user =>{
          this.users.push(user);
        });
    }
  }
}
