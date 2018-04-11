import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Instrument } from "../../models/instrument";
import InstrumentUsed from "../../classes/InstrumentUsed";
import { InstrumentProvider } from "../../providers/instrument/instrument";
import { CompositionProvider } from "../../providers/composition/composition";
import { AssignmentProvider } from "../../providers/assignment/assignment";
import { GroupsProvider } from "../../providers/groups/groups";


@IonicPage()
@Component({
  selector: 'page-new-composition',
  templateUrl: 'new-composition.html',
})
export class NewCompositionPage implements OnInit{
  public groupId: number;
  public name: string;
  public instrumentSelected: Instrument;
  public instrumentsUsed: Array<InstrumentUsed>;
  public timeSignatures: string[];
  public keySignatures: string[];
  public timeSignature: string;
  public keySignature: string;
  public instruments: Instrument[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public instrumentProvider: InstrumentProvider,
              public compositionProvider: CompositionProvider,
              public assignmentProvider: AssignmentProvider,
              public groupProvider: GroupsProvider) {
    this.groupId = this.navParams.get("groupId");
    this.name = '';
    this.timeSignatures = ["2/2", "2/4", "3/4", "4/4", "3/8", "6/8"];
    this.keySignatures = ["C", "Am", "F", "Dm", "Bb", "Gm", "Eb", "Cm", "Ab", "Fm","Db", "Bbm", "Gb", "Ebm", "Cb",
      "Abm", "G", "Em", "D", "Bm", "A", "F#m", "E", "C#m", "B", "G#m", "F#", "D#m", "C#", "A#m"];
    this.timeSignature = "4/4";
    this.keySignature = "C";
    this.instruments = [];
    this.instrumentsUsed = [];
  }

  ngOnInit() {
    this.instrumentProvider.getInstruments()
      .subscribe( instruments =>{
        this.instruments = instruments;
        }
      )
  }

  addInstrument(){
    this.instrumentsUsed.push(new InstrumentUsed(this.instrumentSelected, this.instrumentSelected.name));
    let sameInstrument = this.instrumentsUsed.filter(x => x.instrument.name == this.instrumentSelected.name);

    if(sameInstrument.length>1)
      sameInstrument.map((i, index) => {
        i.labelName = i.instrument.name + " " + (index+1);
      });
  }

  removeInstrument(instrument: InstrumentUsed){
    this.instrumentsUsed = this.instrumentsUsed.filter(obj => obj !== instrument);
    let sameInstruments = this.instrumentsUsed.filter(x => x.instrument.name == this.instrumentSelected.name);

    if (sameInstruments.length == 1) {
      sameInstruments[0].labelName = sameInstruments[0].instrument.name;
    } else {
      sameInstruments.map((i, index) => {
        i.labelName = i.instrument.name + " " + (index+1);
      });
    }
  }

  commit(){
    let instrumentsUsed: any;
    instrumentsUsed = [];
    let instrument: any;
    for (let i of this.instrumentsUsed){
      instrument = {};
      instrument.labelName = i.labelName;
      instrument.name = i.instrument.name.toLowerCase().replace(/ /g,"_");
      instrument.scoresClef = JSON.parse(i.instrument.scoresClef);
      instrument.braces = JSON.parse(i.instrument.braces);
      instrument.user = "-1";

      instrumentsUsed.push(instrument);
    }

    if(this.groupId) {
      this.assignmentProvider.newAssignment(this.groupId, this.name, false)
        .subscribe((_) => {
          this.compositionProvider.commitComposition(this.name, this.timeSignature, this.keySignature, JSON.stringify(instrumentsUsed))
            .subscribe(composition => {
              this.navCtrl.push('EditorPage', {
                "composition": composition,
                "isAssignment": true
              });
            });
        })
    } else {
      this.compositionProvider.commitComposition(this.name, this.timeSignature, this.keySignature, JSON.stringify(instrumentsUsed))
        .subscribe(composition => {
          this.navCtrl.push('EditorPage', {
            "composition": composition,
            "isAssignment": false
          });
        });
    }
  }
}
