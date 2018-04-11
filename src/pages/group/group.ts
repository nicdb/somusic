import { Component } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Group } from "../../models/group";
import { Post, User } from "../../models/social";
import { SocialProvider } from "../../providers/social/social";
import { Storage } from '@ionic/storage';;
import { GroupsProvider } from "../../providers/groups/groups";


@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {
  private post: string;
  private user: User;
  private group: Group;
  private posts: any[];
  private id: number;
  private isAdmin: boolean;
  private dataAv: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialProvider: SocialProvider,
              public groupProvider: GroupsProvider,
              public storage:Storage,
              public alertCtrl: AlertController,
              public events: Events) {
    this.posts = [];
    this.group = this.navParams.get("group");
    this.dataAv = false;

    this.events.subscribe('post:deleted', () => {
      this.getPostGroup();
    });
  }

  ngOnInit() {
    this.storage.get("userID")
      .then(id => {
        this.id = Number(id);
        this.isAdmin = this.group.adminId == this.id;
        this.socialProvider.getUserById(this.id.toString())
          .subscribe(res => {
            this.user = res;
          });
      });
    this.getPostGroup();
  }

  getFriendName(id:string){
    let friend: any;
    return this.socialProvider.getUserById(id)
      .subscribe(res => {
          friend = res;
        },() =>{},
        ()=>{
          return friend.realname;
        });
  }

  getPostGroup(){
    this.groupProvider.getPostGroup(this.group.id)
      .subscribe(res => {
          this.posts = res;
        },(error) =>{console.log(error);},
        ()=>{
          this.dataAv = true;
          this.posts = this.posts.sort((a:Post, b:Post) =>
            parseInt(b.id) - parseInt(a.id)
          );
        });
  }

  onSend() {
    if (this.post) {
      this.storage.get("userID")
        .then(id => {
          this.groupProvider.sendPostGroup(id, this.group.id, this.post)
            .subscribe(() => {
              },
              (error) => {
                this.presentAlert(error.message);
              },
              () => {
                this.post = "";
                this.getPostGroup();
              });
        })

    }
  }

  newAssignment(){
    this.navCtrl.push('NewAssignmentPage', { 'groupId': this.group.id });
  }

  users(){
    this.navCtrl.push('GroupUsersListPage', { 'groupId': this.group.id });
  }

  invites(){
    this.navCtrl.push('GroupInvitesListPage', { 'groupId': this.group.id });
  }

  joinGroup(){
    this.groupProvider.joinGroup(this.group.id)
      .subscribe(() => {
          this.events.publish("invite:mark");
          this.events.publish("group:join");
          this.navCtrl.popToRoot()
        });
  }

  presentAlert(error:string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
