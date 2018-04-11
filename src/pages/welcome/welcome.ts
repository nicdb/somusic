import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConfigProvider } from "../../providers/config/config";

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appBrowser: InAppBrowser,
              public config: ConfigProvider) {}

  login(){
    this.navCtrl.push('LoginPage');
  }

  onBrowser(){
    let url = this.config.rootUrl + "join";
    this.appBrowser.create(url,"_system");
  }
}
