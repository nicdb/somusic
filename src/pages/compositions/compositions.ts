import { Component, OnInit } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Composition } from "../../models/composition";
import { CompositionProvider } from "../../providers/composition/composition";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-compositions',
  templateUrl: 'compositions.html',
})
export class CompositionsPage implements OnInit {
  private compositions: Composition[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public events: Events,
              public compositionProvider: CompositionProvider,
              public toast: ToastController,
              public alertCtrl: AlertController) {
    this.events.subscribe("composition:new", () =>{
      this.getCompositions();
    });

    this.events.subscribe("post:deleted", () =>{
      this.getCompositions();
    });
  }

  ngOnInit() {
    this.getCompositions();
  }

  getCompositions(){
    this.storage.get("userID")
      .then(id => {
        this.compositionProvider.getCompositions(id)
          .subscribe(compositions => {
              this.compositions = compositions;
            },
            () =>{},
            ()=>{
              this.compositions = this.compositions.reverse();
            });
      });
  }

  newComposition(){
    this.navCtrl.push('NewCompositionPage');
  }

  onEditor(composition: Composition){
    this.compositionProvider.setComposition(composition)
      .subscribe(res => {
        this.navCtrl.push(
          'EditorPage', {
            "composition": res,
            "isAssignment": false,
            "isExecution": false,
            "isAdmin": false
          });
      });
  }

  shareComposition(compositionId: string){
    this.compositionProvider.share(compositionId)
      .subscribe(() => {
        this.events.publish('composition:shared');
        let toast = this.toast.create({
          message: "Shared!",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      });
  }

  removeComposition(compositionId: string){
    this.compositionProvider.remove(compositionId)
      .subscribe(() => {
        this.events.publish('composition:deleted');
        this.getCompositions();
      });
  }

  presentConfirm(compositionId: string) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete this composition?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.removeComposition(compositionId);
          }
        }
      ]
    });
    alert.present();
  }
}
