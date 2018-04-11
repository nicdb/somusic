import { Injectable } from '@angular/core';
import { LoginResponse } from '../../models/auth';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ConfigProvider } from "../config/config";


@Injectable()
export class AuthProvider {
  constructor(private http: HttpClient,
              private storage: Storage,
              private config: ConfigProvider) {}

  login(username: string, password: string){
    let data = new FormData();
    data.append('username', username);
    data.append('password', password);

    return this.http.post<LoginResponse>(this.config.rootUrlAPI + 'user/login', data);
  }

  logout(token:string){
    let data = new FormData();
    data.append('registrationId', token);

    return this.http.post<boolean>(this.config.rootUrlAPI + 'user/logout', data)
  }

  registrationToken(registrationId:string){
    let data = {'registrationId': registrationId};
    return this.http.post(this.config.rootUrlAPI + 'push/save', data);
  }

  getAuthorizationHeader(){
    return this.storage.get("token")
      .then(token => {
        return token;
      })
  }
}
