import { Component, Input, OnInit } from '@angular/core';
import { Like, Post, User } from "../../models/social";
import {
  ActionSheetController, AlertController, Events, NavController, NavParams, Platform,
  ToastController
} from "ionic-angular";
import { SocialProvider } from "../../providers/social/social";
import { Composition } from "../../models/composition";
import { Storage } from '@ionic/storage';
import { GroupsProvider } from "../../providers/groups/groups";
import { CompositionProvider } from "../../providers/composition/composition";


@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent implements OnInit {
  @Input("post")postInput: Post;
  protected post: Post;
  protected user: User;
  protected composition: Composition;
  protected liked: boolean;
  protected data: boolean = false;
  protected userId: string;
  protected isUser: boolean;
  protected likes: Like[];

  constructor(public navCtrl: NavController,
              public socialProvider: SocialProvider,
              public navParams: NavParams,
              public storage: Storage,
              public groupsProvider: GroupsProvider,
              public compositionProvider: CompositionProvider,
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform,
              public events: Events,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController) {
    this.likes = [];
    this.composition = null;
    this.events.subscribe(("notification:new"), ()=>(
      this.getLikes()
    ));
  }

  ngOnInit(){
    this.post = this.postInput;
    this.getUser();
    this.getScore();
    this.isLiked();
    this.getLikes();
    this.storage.get("userID")
      .then((id) => {
        this.userId = id;
        if(this.userId == this.post.user_id)
          this.isUser = true;
        else
          this.isUser = false;
      });
  }

  getScore(){
    this.socialProvider.getScoreById(this.post.id)
      .subscribe(res => {
          this.composition = res;
          if(res == null)
            this.composition = null;
        });
  }

  onUser(){
    this.socialProvider.getUserById(this.post.user_id)
      .subscribe(res => {
          this.user = res;
        },
        () =>{},
        ()=>{
          this.navCtrl.push('UserPage', {
            "user": this.user
          });
        });
  }

  onEditor(composition: Composition){
    this.compositionProvider.setComposition(composition)
      .subscribe(res => {
        this.navCtrl.push(
          'EditorPage', {
            "composition": res,
            "isAssignment": false,
            "isExecution": false,
            "isAdmin": false
          });
      });
  }

  onPost(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Post',
      buttons: [
        {
          text: 'Delete Post',
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

  getUser(){
    this.socialProvider.getUserById(this.post.user_id)
      .subscribe((res) => {
        this.user = res;
      },
        ()=>{},
        ()=> {this.data = true;});
  }

  openComments(){
    this.navCtrl.push('CommentsPage', {
      "post": this.post
    });
  }

  deletePost(){
    this.socialProvider.deletePost(this.post.id)
      .subscribe(()=>{
        this.events.publish('post:deleted');
        this.presentToast("Post deleted.")
      })
  }

  isLiked(){
    this.socialProvider.isLiked(this.post.id)
      .subscribe(res => {
        this.liked = res;
        console.log(this.liked)
      });
  }

  like(){
    this.socialProvider.like(this.post.id)
      .subscribe(() => {
        this.isLiked();
        this.getLikes();
      });
  }

  dislike(){
    this.socialProvider.dislike(this.post.id)
      .subscribe(() => {
        this.isLiked();
        this.getLikes();
      });
  }

  getLikes(){
    this.socialProvider.getLikes(this.post.id)
      .subscribe((likes)=>{
        this.likes = likes;
      });
  }

  onLike(id:string){
    this.socialProvider.getUserById(id)
      .subscribe(user =>{
        this.navCtrl.push('UserPage', {"user": user});
      });
  }

  onAllLikes(){
    this.navCtrl.push('LikesListPage', {"likes": this.likes});
  }

  presentToast(msg:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  presentConfirmDelete() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete this post?',
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
            this.deletePost();
          }
        }
      ]
    });
    alert.present();
  }
}
