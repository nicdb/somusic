import { Component } from '@angular/core';
import { Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'WelcomePage';

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              storage: Storage,
              network: Network) {
    storage.get("token").then((token) => {
      if (token) {
        this.rootPage = 'TabsPage';
      }
    });

    platform.ready().then(() => {
      statusBar.backgroundColorByHexString('#01579b');
      splashScreen.hide();
    });

    network.onDisconnect().subscribe(() => {
      this.rootPage = 'NoConnectionPage';
    });

    network.onConnect().subscribe(() => {
      storage.get("token").then((token) => {
        if (token) {
          this.rootPage = 'TabsPage';
        } else {
          this.rootPage = 'WelcomePage';
        }
      });
    });

  }
}
