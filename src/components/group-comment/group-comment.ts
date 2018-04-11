import { Component, Input } from '@angular/core';
import { CommentComponent } from "../comment/comment";
import { GroupsProvider } from "../../providers/groups/groups";
import { Storage } from "@ionic/storage";
import { SocialProvider } from "../../providers/social/social";
import {ActionSheetController, AlertController, Events, NavController, NavParams, Platform} from "ionic-angular";


@Component({
  selector: 'group-comment',
  templateUrl: '../comment/comment.html'
})
export class GroupCommentComponent extends CommentComponent{
  @Input("groupId") groupId: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialProvider: SocialProvider,
              public groupsProvider: GroupsProvider,
              public storage: Storage,
              public events: Events,
              public platform: Platform,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController) {
    super(navCtrl, navParams, socialProvider, groupsProvider, storage, events, platform, actionSheetCtrl, alertCtrl);
  }

  deleteComment(){
    this.groupsProvider.deleteComment(this.comment.id, this.groupId)
      .subscribe(()=>{
        this.events.publish("comment:deleted");
      });
  }
}
