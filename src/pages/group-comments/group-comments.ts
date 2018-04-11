import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommentsPage } from "../comments/comments";
import { GroupsProvider } from "../../providers/groups/groups";
import { SocialProvider } from "../../providers/social/social";

@IonicPage()
@Component({
  selector: 'page-group-comments',
  templateUrl: 'group-comments.html',
})
export class GroupCommentsPage extends CommentsPage {
  private groupId: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public groupsProvider: GroupsProvider,
              public socialProvider: SocialProvider,
              public events: Events) {
    super(navCtrl, navParams, socialProvider, events);
    this.groupId = navParams.get("groupId");
  }

  getComments(){
    this.groupsProvider.getComments(this.post.id, this.groupId)
      .subscribe(res => {
          this.comments = res;
        });
  }

  onSend() {
    if (this.comment) {
      this.groupsProvider.sendComment(this.post.id, this.comment, this.groupId)
        .subscribe(res => {
            console.log(res);
          },
          (error) => {
            console.log(error);
          },
          () => {
            this.comment = null;
            this.getComments();
          });
    }
  }
}
