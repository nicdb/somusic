import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/social";
import { GroupsProvider } from "../../providers/groups/groups";

@IonicPage()
@Component({
  selector: 'page-group-invites-list',
  templateUrl: 'group-invites-list.html',
})
export class GroupInvitesListPage {
  private users: User[];
  private groupId: string;
  private dataAv: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public groupsProvider: GroupsProvider,
              public events: Events) {
    this.users = [];
    this.dataAv = false;
    this.groupId = this.navParams.get("groupId");
    events.subscribe('invite:sent', () => {
      this.getUsers();
    });
  }

  ngOnInit(){
    this.getUsers();
  }

  getUsers(){
    this.groupsProvider.inviteLeft(this.groupId)
      .subscribe(users => {
          this.users = users;
          this.dataAv = true;
        });
  }
}
