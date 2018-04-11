import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Comment, Like, Post, User } from "../../models/social";
import { Group }      from "../../models/group";
import 'rxjs/add/operator/map';
import { ConfigProvider } from "../config/config";

@Injectable()
export class GroupsProvider {

  constructor(private http: HttpClient,
              private config: ConfigProvider) {}

  getGroups(){
    return this.http.get<Group[]>(this.config.rootUrlAPI + 'group/');

  }

  getPersonalGroups(){
    return this.http.get<Group[]>(this.config.rootUrlAPI + 'group/list/');
  }

  getPersonalAdminGroups(){
    return this.http.get<Group[]>(this.config.rootUrlAPI + 'group/list/admin/');
  }

  getPersonalUserGroups(){
    return this.http.get<Group[]>(this.config.rootUrlAPI + 'group/list/user/');
  }

  newGroup(title: string, description: string){
    let data = {'title': title,
                'description': description};

    return this.http.post<Group>(this.config.rootUrlAPI + 'group/create/', data);
  }

  getPostGroup(id: string){
    return this.http.get<Post[]>(this.config.rootUrlAPI + 'group/post/' + id);
  }

  getUsersGroup(id: string){
    return this.http.get<User[]>(this.config.rootUrlAPI + 'group/user/list/' + id);
  }

  sendPostGroup(id: string, groupId: string, post: string){
    let data = {'userId': id,
                'msg': post,
                'groupId': groupId};

    return this.http.post(this.config.rootUrlAPI + 'group/post/add', data);
  }

  joinGroup(groupId: string){
    let data = {'groupId': groupId};

    return this.http.post(this.config.rootUrlAPI + 'group/user/join', data);
  }

  leaveGroup(groupId: string){
    let data = {'groupId': groupId};

    return this.http.post(this.config.rootUrlAPI + 'group/leave', data);
  }

  deleteGroup(groupId: string){
    let data = {'groupId': groupId};

    return this.http.post<string>(this.config.rootUrlAPI + 'group/delete/', data);
  }

  invite(groupId: string, userId: string){
    let data = {'userId': userId,
                'groupId': groupId};

    return this.http.post(this.config.rootUrlAPI + 'group/user/invite', data);
  }

  decline(groupId: string){
    let data = {'groupId': groupId};

    return this.http.post(this.config.rootUrlAPI + 'group/user/decline', data);
  }

  inviteList(){
    return this.http.get<Group[]>(this.config.rootUrlAPI + 'group/invite/list');
  }

  inviteLeft(groupId:string){
    return this.http.get<User[]>(this.config.rootUrlAPI + 'group/' + groupId + '/invite/left/');
  }

  search(name:string){
    return this.http.get<Group[]>(this.config.rootUrlAPI + 'group/search/' + name);
  }

  deletePost(postId:string){
    return this.http.get<string>(this.config.rootUrlAPI + 'group/post/' + postId + '/delete');
  }

  deleteComment(commentId:string, groupId: string){
    return this.http.get<string>(this.config.rootUrlAPI + 'group/' + groupId + '/post/comment/delete/' + commentId);
  }

  sendComment(id: string, comment: string, groupId: string){
    let data = {'entityId': id,
                'msg': comment,
                'groupId': groupId};

    return this.http.post(this.config.rootUrlAPI + 'group/post/comment/add', data);
  }

  getComments(postId: string, groupId: string){
    return this.http.get<Comment[]>(this.config.rootUrlAPI + 'group/' + groupId + '/post/comment/' + postId);
  }

  isLiked(postId: string, groupId: string){
    return this.http.get<boolean>(this.config.rootUrlAPI + 'group/' + groupId + '/post/' + postId + '/isliked/');
  }

  like(postId: string, groupId: string){
    let data = {'postId': postId,
                'groupId': groupId};

    return this.http.post<boolean>(this.config.rootUrlAPI + 'group/post/like', data);
  }

  dislike(postId: string, groupId: string){
    let data = {'postId': postId,
                'groupId': groupId};

    return this.http.post<boolean>(this.config.rootUrlAPI + 'group/post/unlike', data);
  }

  getLikes(postId: string, groupId: string){
    return this.http.get<Like[]>(this.config.rootUrlAPI + 'group/' + groupId + '/post/' + postId + '/like');
  }
}
