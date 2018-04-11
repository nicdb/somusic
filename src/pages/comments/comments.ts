import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Post, Comment } from "../../models/social";
import { SocialProvider } from "../../providers/social/social";

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage implements OnInit {
  protected post: Post;
  protected comments: Comment[];
  protected comment: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialProvider: SocialProvider,
              public events: Events) {
    this.post = navParams.get("post");

    this.events.subscribe("comment:deleted", () => {
      this.getComments();
    })
  }

  ngOnInit(){
    this.getComments();
  }

  getComments(){
    this.socialProvider.getComments(this.post.id)
      .subscribe(res => {
          this.comments = res;
        });
  }

  onSend() {
    if (this.comment) {
      this.socialProvider.sendComment(this.post.id, this.comment)
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
