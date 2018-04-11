import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from "../../providers/auth/auth";
import { Storage } from '@ionic/storage';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public storage: Storage,
              public alertCtrl: AlertController,
              public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.authProvider.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(res => {
        if(res.result){
          this.storage.set("isAuthenticated", true);
          this.storage.set("userID", res.userID);
          this.storage.set("token", res.token);
          this.navCtrl.push('TabsPage');
        } else {
          let alert = this.alertCtrl.create({
            title: 'Login',
            subTitle: 'Incorrect Username or Password',
            buttons: ['Ok']
          });
          alert.present();
        }
    },
      error =>{
        let alert = this.alertCtrl.create({
          title: 'Login',
          subTitle: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }
}
