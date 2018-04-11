import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { InstrumentProvider } from "../../providers/instrument/instrument";
import { CompositionProvider } from "../../providers/composition/composition";
import { User } from "../../models/social";
import InstrumentUsed from "../../classes/InstrumentUsed";
import { AssignmentProvider } from "../../providers/assignment/assignment";
import { GroupsProvider } from "../../providers/groups/groups";
import { NewCompositionPage } from "../new-composition/new-composition";


@IonicPage()
@Component({
  selector: 'page-new-composition-multi',
  templateUrl: 'new-composition-multi.html',
})
export class NewCompositionMultiPage extends NewCompositionPage {
  public groupId: number;
  public users: User[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public instrumentProvider: InstrumentProvider,
              public compositionProvider: CompositionProvider,
              public assignmentProvider: AssignmentProvider,
              public groupProvider: GroupsProvider,
              public alertCtrl: AlertController) {
    super(navCtrl, navParams, instrumentProvider, compositionProvider, assignmentProvider, groupProvider);
    this.groupId = this.navParams.get("groupId");
  }

  ngOnInit() {
    super.ngOnInit();
    this.getUsers();
  }

  addInstrument() {
    this.instrumentsUsed.push(new InstrumentUsed(this.instrumentSelected, this.instrumentSelected.name, this.users[0]));
    let sameInstrument = this.instrumentsUsed.filter(x => x.instrument.name == this.instrumentSelected.name);

    if(sameInstrument.length>1)
      sameInstrument.map((i, index) => {
        i.labelName = i.instrument.name + " " + (index+1);
      });
  }

  commit(){
    let instrumentsUsed: any;
    instrumentsUsed = [];
    let instrument: any;
    for (let i of Array.from(this.instrumentsUsed)){
      instrument = {};
      instrument.labelName = i.labelName;
      instrument.name = i.instrument.name.toLowerCase().replace(/ /g,"_");
      instrument.scoresClef = JSON.parse(i.instrument.scoresClef);
      instrument.braces = JSON.parse(i.instrument.braces);
      instrument.user = i.user.id;
      instrumentsUsed.push(instrument);
    }
    this.assignmentProvider.newAssignment(this.groupId, this.name, true)
      .subscribe((_) => {
        this.compositionProvider.commitComposition(this.name, this.timeSignature, this.keySignature, JSON.stringify(instrumentsUsed))
          .subscribe(composition => {
            this.navCtrl.push('EditorPage', {
              "composition": composition,
              "isAssignment": true
            }, (error) => {
              let alert = this.alertCtrl.create({
                title: 'NewComposition',
                subTitle: error.message,
                buttons: ['Ok']
              });
              alert.present();
            });
            });
          });

    }

  getUsers(){
    this.groupProvider.getUsersGroup(this.groupId.toString())
      .subscribe( users => {
        this.users = users;
      })
  }

  editUser(instrument: InstrumentUsed){
    instrument.user = instrument.userSelected;
  }

}
