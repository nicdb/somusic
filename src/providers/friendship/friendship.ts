  import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Friendship, User } from "../../models/social";
import {ConfigProvider} from "../config/config";

@Injectable()
export class FriendshipProvider{

  constructor(private http: HttpClient,
              private config: ConfigProvider) {}

  getFriends(){
    return this.http.get<User[]>(this.config.rootUrlAPI + 'social/friend/');
  }

  getRequests(request:string){
    return this.http.get<User[]>(this.config.rootUrlAPI + 'social/friend/request/info/' + request);
  }

  isFriend(id:string){
    return this.http.get<Friendship>(this.config.rootUrlAPI + 'social/friend/status/info/' + id);
  }

  addFriend(id:string, userId:string){
    let data = {'requesterId': id,
                'userId': userId };

    return this.http.post<string>(this.config.rootUrlAPI + "social/friend/request", data);
  }

  acceptFriend(id:string){
    let data = {'requesterId': id};
    return this.http.post<string>(this.config.rootUrlAPI + "social/friend/accept", data);
  }

  ignoreFriend(id:string){
    let data = {'requesterId': id};
    return this.http.post<string>(this.config.rootUrlAPI + "social/friend/ignore", data);
  }

  cancelRequestFriend(id:string){
    let data = {'requesterId': id};
    return this.http.post<string>(this.config.rootUrlAPI + "social/friend/cancel", data);
  }

  deleteFriend(id:string){
    return this.http.get<string>(this.config.rootUrlAPI + "social/friend/" + id + "/delete");
  }
}
