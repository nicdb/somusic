import { Component, Input } from '@angular/core';
import { PostComponent } from "../post/post";

@Component({
  selector: 'group-post',
  templateUrl: '../post/post.html'
})
export class GroupPostComponent extends PostComponent{
  @Input("groupId")groupId: string;
  composition = null;

  getScore(){
    return;
  }

  openComments(){
    this.navCtrl.push('GroupCommentsPage', {
      "post": this.post,
      "groupId": this.groupId
    });
  }

  deletePost(){
    this.groupsProvider.deletePost(this.post.id)
      .subscribe(()=>{
        this.events.publish('post:deleted');
        this.presentToast("Post deleted.")
      })
  }

  isLiked(){
    this.groupsProvider.isLiked(this.post.id, this.groupId)
      .subscribe(res => {
        this.liked = res;
      });
  }

  like(){
    this.groupsProvider.like(this.post.id, this.groupId)
      .subscribe(() => {
        this.isLiked();
        this.getLikes();
      });
  }

  dislike(){
    this.groupsProvider.dislike(this.post.id, this.groupId)
      .subscribe(() => {
        this.isLiked();
        this.getLikes();
      });
  }

  getLikes(){
    this.groupsProvider.getLikes(this.post.id, this.groupId)
      .subscribe((likes)=>{
        this.likes = likes;
      });
  }
}
