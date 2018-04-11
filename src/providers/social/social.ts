import 'rxjs/add/operator/map';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Composition } from "../../models/composition";
import { Post, User, Comment, Like } from "../../models/social";
import { ConfigProvider } from "../config/config";

@Injectable()
export class SocialProvider {

  constructor(private http: HttpClient,
              private config: ConfigProvider) {}

  getUserById(id: string){
    return this.http.get<User>(this.config.rootUrlAPI + 'user/' + id);
  }

  getUsers(){
    return this.http.get<User[]>(this.config.rootUrlAPI + 'user/');
  }

  getUserPosts(id: number){
    console.log(id);
    return this.http.get<Post[]>(this.config.rootUrlAPI + 'social/post/' + id);
  }

  getPosts(){
    return this.http.get<Post[]>(this.config.rootUrlAPI + 'social/post/');
  }

  getPostsByInterval(index: string){
    return this.http.get<Post[]>(this.config.rootUrlAPI + 'social/post/interval/' + index);
  }

  getScoreById(id: string){
    return this.http.get<Composition>(this.config.rootUrlAPI + 'social/post/composition/' + id);
  }

  sendPost(post: string){
    let data = {'msg': post};

    return this.http.post(this.config.rootUrlAPI + 'social/post/add', data);
  }

  deletePost(idPost: string){
    return this.http.get<string>(this.config.rootUrlAPI + 'social/post/' + idPost + '/delete');
  }

  deleteComment(commentId: string){
    return this.http.get<string>(this.config.rootUrlAPI + 'social/post/comment/delete/' + commentId);
  }

  sendComment(id: string, comment: string){
    let data = {'entityId': id,
      'msg': comment};

    return this.http.post(this.config.rootUrlAPI + 'social/post/comment/add', data);
  }

  getComments(postId: string){
    return this.http.get<Comment[]>(this.config.rootUrlAPI + 'social/post/comment/' + postId);
  }

  isLiked(postId: string){
    return this.http.get<boolean>(this.config.rootUrlAPI + 'social/post/' + postId + '/isliked/');
  }

  like(postId: string){
    let data = {'postId': postId};

    return this.http.post<boolean>(this.config.rootUrlAPI + 'social/post/like', data);
  }

  dislike(postId: string){
    let data = {'postId': postId};

    return this.http.post<boolean>(this.config.rootUrlAPI + 'social/post/unlike', data);
  }

  getLikes(postId: string){
    return this.http.get<Like[]>(this.config.rootUrlAPI + 'social/post/' + postId + '/like');
  }

  search(realname: string){
    return this.http.get<User[]>(this.config.rootUrlAPI + 'user/search/' + realname);
  }
}
