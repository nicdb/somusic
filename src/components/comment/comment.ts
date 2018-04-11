import { Component, Input, OnInit } from '@angular/core';
import { Comment, User } from "../../models/social";
import { SocialProvider } from "../../providers/social/social";
import { Storage } from "@ionic/storage";
import { ActionSheetController, AlertController, Events, NavController, NavParams, Platform } from "ionic-angular";
import { GroupsProvider } from "../../providers/groups/groups";
@Component({
  selector: 'comment',
  templateUrl: 'comment.html'
})
export class CommentComponent implements OnInit{
  @Input("comment")comment: Comment;
  protected userId: string;
  protected isUser: boolean;
  protected user: User;
  protected isDataAvailable: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialProvider: SocialProvider,
              public groupsProvider: GroupsProvider,
              public storage: Storage,
              public events: Events,
              public platform: Platform,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController) {
    this.user = null;
  }

  ngOnInit(){
    this.storage.get("userID")
      .then((id) => {
        this.userId = id;
        if(this.userId == this.comment.userId)
          this.isUser = true;
        else
          this.isUser = false;
        console.log(this.isUser);
      });

    this.socialProvider.getUserById(this.comment.userId)
      .subscribe(res => {
          this.user = res;
        });
  }

  onUser(){
    this.navCtrl.push('UserPage', {
      "user": this.user
    });
  }

  onComment(){

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Post',
      buttons: [
        {
          text: 'Delete Comment',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            this.presentConfirmDelete();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  presentConfirmDelete() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete this comment?',
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
            this.deleteComment();
          }
        }
      ]
    });
    alert.present();
  }

  deleteComment(){
    this.socialProvider.deleteComment(this.comment.id)
      .subscribe(()=>{
        this.events.publish("comment:deleted");
      })
  }
}
