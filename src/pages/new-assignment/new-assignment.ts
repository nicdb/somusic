import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AssignmentProvider } from "../../providers/assignment/assignment";

@IonicPage()
@Component({
  selector: 'page-new-assignment',
  templateUrl: 'new-assignment.html',
})
export class NewAssignmentPage {
  groupId: number;
  name: string = '';
  isMultiUser: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public assignmentProvider: AssignmentProvider,
              public alertCtrl: AlertController) {
    this.groupId = this.navParams.get("groupId");
    this.isMultiUser = false;
  }

  newComposition(){
    if(this.isMultiUser)
      this.navCtrl.push('NewCompositionMultiPage', {'groupId': this.groupId });
    else
      this.navCtrl.push('NewCompositionPage', {'groupId': this.groupId });
  }

  presentAlert(error:string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
