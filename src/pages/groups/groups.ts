import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from "../../models/group";
import { GroupsProvider } from "../../providers/groups/groups";
import { FormControl } from "@angular/forms";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage  implements OnInit {
  private groups: Group[];
  private searchControl: FormControl;
  private searchTerm:string;
  private id: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public groupProvider: GroupsProvider,
              public storage: Storage,
              public events: Events){
    this.searchControl = new FormControl();
    this.searchTerm = '';
    this.id = null;
    this.groups = [];

    this.events.subscribe('group:new', () => {
      this.getGroups();
    });

    this.events.subscribe('group:join', () => {
      this.getGroups();
    });

    this.events.subscribe('group:leave', () => {
      this.getGroups();
    });

    this.events.subscribe('group:delete', () => {
      this.getGroups();
    });
  }

  ngOnInit(){
    this.storage.get("userID")
      .then( id => {
        this.id = id;
        this.getGroups();
      })
  }

  getGroups(){
    this.groupProvider.getGroups()
      .subscribe(res => {
          this.groups = res;
        });
  }

  searchGroups(groupName:string){
    if(groupName.length>0) {
      this.groupProvider.search(groupName)
        .subscribe(res => {
            this.groups = res;
          });
    } else {
      this.getGroups();
    }
  }

  onGroup(group:Group){
    this.navCtrl.push('GroupPage', {"group": group});
  }

  joinGroup(group: Group){
    this.groupProvider.joinGroup(group.id)
      .subscribe(() => {
        this.events.publish("group:join");
        this.getGroups();
        this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-2));
      })
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
        this.getGroups();
      })
  }
}
