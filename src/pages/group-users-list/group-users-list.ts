import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/social";
import { GroupsProvider } from "../../providers/groups/groups";

@IonicPage()
@Component({
  selector: 'page-group-users-list',
  templateUrl: 'group-users-list.html',
})
export class GroupUsersListPage implements OnInit{
  private users: User[];
  private groupId: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public groupsProvider: GroupsProvider) {
    this.users = [];
    this.groupId = this.navParams.get("groupId");
  }

  ngOnInit(){
    this.getUsers();
  }

  getUsers(){
    this.groupsProvider.getUsersGroup(this.groupId)
      .subscribe(users => {
          this.users = users;
        });
  }
}
