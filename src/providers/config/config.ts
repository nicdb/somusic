import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfigProvider {
  private _rootUrl: string;
  private _rootUrlAPI: string;
  private _senderId: string;
  private _pushServiceUrl: string;

  constructor(public http: HttpClient) {
    this._rootUrl = "http://localhost/oxwall/";
    this._rootUrlAPI = this._rootUrl + "smapi/";
    this._senderId = '[ 390 ... Insert SenderID Here ]';
    this._pushServiceUrl = 'http://push.api.phonegap.com/v1/push';
  }

  get rootUrl(): string {
    return this._rootUrl;
  }

  get rootUrlAPI(): string {
    return this._rootUrlAPI;
  }

  get senderId(): string {
    return this._senderId;
  }

  get pushServiceUrl(): string {
    return this._pushServiceUrl;
  }
}
