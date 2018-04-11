import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Notification } from "../../models/social";
import { ConfigProvider } from "../config/config";

@Injectable()
export class NotificationProvider {

  constructor(private http: HttpClient,
              private config: ConfigProvider) {
  }

  getNotifications(id: string){
    return this.http.get<Notification[]>(this.config.rootUrlAPI + 'social/notifications/notviewed/' + id);
  }

  getViewedNotification(id: string){
    return this.http.get<Notification[]>(this.config.rootUrlAPI + 'social/notifications/viewed/' + id);
  }

  markNotification(ids: string[]){
    let data = {"ids": JSON.stringify(ids)};

    return this.http.post<string>(this.config.rootUrlAPI + 'social/notifications/mark', data);
  }
}
