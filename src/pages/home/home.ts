import { Component } from '@angular/core';
import { AlertController, Events, InfiniteScroll, IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialProvider } from "../../providers/social/social";
import { Post } from "../../models/social";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  private post: string;
  private posts: Post[];
  private index: number;
  private batch: number;
  private postsFinished: boolean;
  private dataAv: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialProvider: SocialProvider,
              public alertCtrl: AlertController,
              public events: Events) {
    this.posts = [];
    this.index = 0;
    this.batch = 5;
    this.postsFinished = false;
    this.dataAv = false;

    this.events.subscribe('composition:new', () => {
      this.index = 0;
      this.getPosts(this.index);
    });
    this.events.subscribe('composition:shared', () => {
      this.index = 0;
      this.getPosts(this.index);
    });
    this.events.subscribe('composition:deleted', () => {
      this.index = 0;
      this.getPosts(this.index);
    });
    this.events.subscribe('post:deleted', () => {
      this.index = 0;
      this.getPosts(this.index);
    });
  }

  ngOnInit() {
    this.getPosts(this.index);
  }

  getPosts(index:number){
    this.socialProvider.getPostsByInterval(index.toString())
      .subscribe(posts => {
          if(index == 0) {
            this.posts = posts;
            this.postsFinished = false;
          } else {
            if(!this.postsFinished) {
              this.posts.concat(posts);
              for (let pst of posts)
                this.posts.push(pst);
            }
          }
          if(posts.length == 0)
            this.postsFinished = true;
          this.dataAv = true;
        },
        (error) => {
          this.presentAlert(error.message);
        });
  }

  onSend() {
    if (this.post) {
      this.socialProvider.sendPost(this.post)
        .subscribe(() => {
            this.index = 0;
            this.getPosts(this.index);
            this.post="";
          },
          (error) => {
            this.presentAlert(error.message);
          });
    }
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    if(!this.postsFinished) {
      this.index = this.index + this.batch;
      this.getPosts(this.index);
    }
      infiniteScroll.complete();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.socialProvider.getPostsByInterval("0")
        .subscribe(posts => {
            this.posts = posts;
            this.postsFinished = false;
          },
          (error) => {
            this.presentAlert(error.message);
          },
          ()=>{
            refresher.complete();
          });
    }, 3000);
  }

  presentAlert(error: string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
