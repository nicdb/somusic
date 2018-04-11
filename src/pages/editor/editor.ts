import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams } from 'ionic-angular';

import * as Vex from "vexflow";
import Renderer from "../../assets/js/somusic/Renderer";

import { Composition } from "../../models/composition";
import { Assignment } from "../../models/assignment";

import { EditorProvider } from "../../providers/editor/editor";
import { CompositionProvider } from "../../providers/composition/composition";
import { AssignmentProvider } from "../../providers/assignment/assignment";
import { ConfigProvider } from "../../providers/config/config";


@IonicPage()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
})
export class EditorPage implements OnInit, AfterViewInit {
  @ViewChild('score', {read: ElementRef}) canvasRef: ElementRef;

  private isAssignment: boolean;
  private isExecution: boolean;
  private assignment: Assignment;
  private isAdmin: boolean;
  private executionId: number;
  private execution: number;

  private interval: any;
  private composition: Composition;
  private canvas: any;
  private renderer: Renderer;
  private noteColor: string;
  private notes: Map<string, string>;
  private rests: Map<string, string>;
  private accidentals: Map<string, string>;
  private additional: Map<string, string>;
  private voice: Map<string, number>;
  private notesKeys: string [];
  private restsKeys: string [];
  private accidentalsKeys: string [];
  private additionalKeys: string [];
  private voiceKeys: string [];
  private lastUpdate = Date.now();
  private selectedNotes = [];
  private voiceIndex: number;

  private durationSelected: string;
  private accidentalSelected: string;
  //private additionalSelected: string;
  //private voiceSelected: string;

  private imgPath: string;
  private addNoteURL: string;
  private deleteNotesURL: string;
  private addTieURL: string;
  private getCompositionURL: string;
  private accidentalUpdateURL: string;
  private closeURL: string;
  //private removeInstrumentURL: string;
  private exportURL: string;
  private dotsUpdateURL: string;
  private moveNotesURL: string;
  private setNoteAnnotationTextURL: string;
  private changeNoteDurationURL: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public editorProvider: EditorProvider,
              public compositionProvider: CompositionProvider,
              public assignmentProvider: AssignmentProvider,
              public events: Events,
              public config: ConfigProvider) {

    this.composition = navParams.get("composition");
    this.isAssignment = navParams.get("isAssignment");
    this.isExecution = navParams.get("isExecution");
    this.assignment = navParams.get("assignment");
    this.executionId = navParams.get("executionId");
    this.isAdmin = navParams.get("isAdmin");
    this.execution = navParams.get("execution");

    this.initUrls();
    this.initKeys();

    if(!this.isAdmin || this.assignment.isMultiUser == 1) {
      this.noteColor = "black";
    } else {
      this.noteColor = "red";
    }

    this.voiceIndex = 0;

    this.interval = setInterval(() => {
      if(Date.now() > this.lastUpdate-5000 && this.selectedNotes.length==0)
        this.ajaxRequest(this.getCompositionURL, {});
    }, 10000);
  }

  ngOnInit() {
    console.log(this.composition);
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.renderer = new Renderer(this.canvas, this.composition.instrumentsUsed, true);
    this.renderer.updateComposition(this.composition);
  }

  ionViewWillLeave(){
    clearInterval(this.interval);
  }

  addComposition(){
    if(this.isAssignment){
      this.assignmentProvider.saveNewAssignment()
        .subscribe(() => {
          clearInterval(this.interval);
          this.events.publish("assignment:new");
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-4));
        })
    } else if (this.isExecution && !this.isAdmin && this.execution == 0){
      this.assignmentProvider.editExecution(this.assignment.id)
        .subscribe(() => {
          clearInterval(this.interval);
          this.events.publish("execution:new");
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
        });
    } else if (this.isExecution && !this.isAdmin && this.execution == -1){
      this.assignmentProvider.commitExecution(this.assignment.id)
        .subscribe(() => {
          clearInterval(this.interval);
          this.events.publish("execution:edit");
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
        });
    } else if (this.isExecution && this.isAdmin){
      this.assignmentProvider.makeCorrection(this.executionId, this.composition)
        .subscribe(() => {
          clearInterval(this.interval);
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-2));
        });
    } else {
      this.compositionProvider.addComposition()
        .subscribe(() => {
          clearInterval(this.interval);
          this.events.publish("composition:new");
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-3));
        });
    }
  }

  processClick(e){
    let rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    let staveIndex = this.renderer.measures[0].getStaveIndex(y);
    let measureIndex = this.getMeasureIndex(x);
    let instrumentName = this.renderer.measures[measureIndex].instrumentsName[staveIndex];
    let notes = this.renderer.measures[measureIndex].notes[instrumentName][this.voiceIndex];
    let noteIndex = this.getNoteIndex(x, notes);
    let pitch = this.calculatePitch(e);
    let found = false;
    let note = notes[noteIndex];

    if(note.noteType=="n"){
      if(!this.isAdmin && note.note_heads[0].style.fillStyle=="red")
        return;
      for(let j=0; j<note.keys.length; j++) {
        if(pitch == note.keys[j]) {
          found = true;
          let isSelected = false;
          console.log(this.selectedNotes.length);
          for(let k=0; k<this.selectedNotes.length && !isSelected; k++) {
            let sn = this.selectedNotes[k];
            if(sn.note===note) {
              this.selectedNotes.splice(k, 1);
              note.setStyle({fillStyle: (typeof note.oldStyle!=="undefined" ? note.oldStyle:"black")});
              isSelected = true;
            }
          }
          if(!isSelected) {
            this.selectedNotes.push({"note": note,
              "voiceName": instrumentName,
              "index": staveIndex,
              "measureIndex": measureIndex,
              "noteIndex": noteIndex});
            note.oldStyle = note.note_heads[0].style.fillStyle;
            note.setStyle({fillStyle: "blue"});
          }
        }
      }
    }
    if(!found){
      this.addNote(e, staveIndex, measureIndex, noteIndex);
    }
    this.renderer.renderAndDraw();
  }

  delNotes (e) {
    if(this.selectedNotes.length == 0) {
      this.shakeScore('No note selected');
      return;
    }

    let toRemove = [];

    for(let i=0; i<this.selectedNotes.length; i++)
      toRemove.push({
        staveIndex: this.selectedNotes[i].index,
        measureIndex: this.selectedNotes[i].measureIndex,
        noteIndex: this.selectedNotes[i].noteIndex
      });

    let data = {'toRemove': JSON.stringify(toRemove)};

    this.ajaxRequest(this.deleteNotesURL, data);
    this.renderer.renderAndDraw();
  }

  swipeUp(event: any): any {
    this.moveNotes(1);
  }

  swipeDown(event: any): any {
    this.moveNotes(-1);
  }

  tie (e) {
    if(this.selectedNotes.length==0) {
      this.shakeScore('Tie error');
      return;
    }
    let toTie = [];
    for(let i=0; i<this.selectedNotes.length; i++)
      toTie.push({
        voiceName: this.selectedNotes[i].voiceName,
        staveIndex: this.selectedNotes[i].index,
        measureIndex: this.selectedNotes[i].measureIndex,
        noteIndex: this.selectedNotes[i].noteIndex
      });

    let data = {'toTie': JSON.stringify(toTie)};

    this.ajaxRequest(this.addTieURL, data);
    this.renderer.renderAndDraw();
  }

  addNote (e, staveIndex, measureIndex, noteIndex) {
    let duration = "-1";

    if(this.durationSelected != null)
      duration = this.durationSelected;

    let pitch = this.calculatePitch(e);
    let noteLength = {"1":1, "2":2, "4":4, "8":8, "16":16, "32":32, "64":64,
      "1r":1, "2r":2, "4r":4, "8r":8, "16r":16, "32r":32, "64r":64};
    let isPause = duration.indexOf("r")>=0;

    let data = {'staveIndex': staveIndex,
                'measureIndex': measureIndex,
                'noteIndex': noteIndex,
                'newNote': pitch,
                'duration': noteLength[duration],
                'isPause': isPause.toString(),
                'accidental': this.accidentalSelected,
                'color': this.noteColor};

    this.ajaxRequest(this.addNoteURL, data);
  }

  accidentalUpdate (type) {
    if(this.selectedNotes.length==0)
      return;
    let toUpdate = [];
    for(let i=0; i<this.selectedNotes.length; i++)
      toUpdate.push({
        staveIndex: this.selectedNotes[i].index,
        measureIndex: this.selectedNotes[i].measureIndex,
        noteIndex: this.selectedNotes[i].noteIndex
      });

    let data = {'toUpdate': JSON.stringify(toUpdate),
                'accidental': type};

    this.ajaxRequest(this.accidentalUpdateURL, data);
  }

  dotsUpdate (value) {
    if(this.selectedNotes.length==0)
      return;
    let toUpdate = [];
    for(let i=0; i<this.selectedNotes.length; i++)
      toUpdate.push({
        staveIndex: this.selectedNotes[i].index,
        measureIndex: this.selectedNotes[i].measureIndex,
        noteIndex: this.selectedNotes[i].noteIndex
      });

    let data = {'toUpdate': JSON.stringify(toUpdate),
                'dotValue': value};

    this.ajaxRequest(this.dotsUpdateURL, data);
  }

  close() {
    clearInterval(this.interval);
    this.ajaxRequest(this.closeURL, {});
  }

  update() {
    this.ajaxRequest(this.getCompositionURL, {});
  }

  /**removeCompositionInstrument(row, index){
    let editor = this;
    $.ajax({
      type: 'post',
      url: this.removeInstrumentURL,
      data: {"index": index},
      dataType: 'JSON',
      success: function(data){
        console.log(data);
        if(data) {
          row.parentNode.removeChild(row);
          SoMusic.editor.update();
        }
      },
      error: function( XMLHttpRequest, textStatus, errorThrown ){
        console.log(textStatus);
      }
    });
  }**/

  moveNotes(value) {
    if(this.selectedNotes.length==0)
      return;
    let editor = this;
    let toUpdate = [];
    let selected = this.selectedNotes;
    for(let i=0; i<this.selectedNotes.length; i++)
      toUpdate.push({
        staveIndex: this.selectedNotes[i].index,
        measureIndex: this.selectedNotes[i].measureIndex,
        noteIndex: this.selectedNotes[i].noteIndex
      });

    this.ajaxRequest(this.moveNotesURL, {"toUpdate":JSON.stringify(toUpdate), "value":value}, function(data) {
      editor.lastUpdate=Date.now();
      editor.renderer.updateComposition(data);
      selected.forEach(function(item, index, array){
        editor.selectedNotes.push(item);
        let note = editor.renderer.measures[item.measureIndex].notes[item.voiceName][0][item.noteIndex];
        //note.oldStyle = note.note_heads[0].style.fillStyle;
        note.oldStyle = editor.noteColor;
        note.setStyle({fillStyle: "blue", strokeStyle:"black"});
      });
      editor.renderer.renderAndDraw();
    });
  }

  addAnnotationLetter(letter) {
    if(this.selectedNotes.length!=1)
      return;
    let instrument = this.renderer.composition.instrumentsScore[this.selectedNotes[0].index].instrument;
    console.log(instrument);
    if(instrument!="4_voices" && instrument!="singer_voice")
      return;
    console.log(instrument);
    let editor = this;
    let notes = this.renderer.measures[this.selectedNotes[0].measureIndex].notes[this.selectedNotes[0].voiceName][this.voiceIndex];
    let note = notes[this.selectedNotes[0].noteIndex];
    let text = "";
    note.modifiers.forEach(function(item, index){
      if(typeof item.text !== "undefined") {
        text += item.text;
        note.modifiers.splice(index, 1);
      }
    });
    if(letter=="Backspace")
      text = text.substring(0, text.length-1);
    else if(letter==" " || letter=="Enter") {
      let selectedNotes = this.selectedNotes;
      selectedNotes[0].note.setStyle({fillStyle: (typeof selectedNotes[0].note.oldStyle!=="undefined"?selectedNotes[0].note.oldStyle:"black")});
      this.ajaxRequest(this.setNoteAnnotationTextURL, {
        "measureIndex": editor.selectedNotes[0].measureIndex,
        "staveIndex": editor.selectedNotes[0].index,
        "noteIndex": editor.selectedNotes[0].noteIndex,
        "text": text
      }, function (data){
        console.log(data);
      });
      if(letter==" ") {
        let closeNote = this.getCloseNote(selectedNotes[0], 1);
        if(closeNote.measureIndex>=0 && closeNote.measureIndex<editor.renderer.measures.length &&
          closeNote.noteIndex>=0 && closeNote.noteIndex<=editor.renderer.measures[closeNote.measureIndex].notes[closeNote.voiceName][this.voiceIndex].length) {
          editor.selectedNotes = [closeNote];
          closeNote.note.oldStyle = closeNote.note.note_heads[0].style.fillStyle;
          closeNote.note.setStyle({fillStyle: "blue"});
        }
      }
    }
    else
      text += letter;

    note.addModifier(0, new Vex.Flow.Annotation(text).setVerticalJustification(Vex.Flow.Annotation.VerticalJustify.TOP));

    this.renderer.renderAndDraw();
  }

  changeNoteDuration(duration) {
    let toChange = [];
    for(let i=0; i<this.selectedNotes.length; i++)
      toChange.push({
        voiceName: this.selectedNotes[i].voiceName,
        staveIndex: this.selectedNotes[i].index,
        measureIndex: this.selectedNotes[i].measureIndex,
        noteIndex: this.selectedNotes[i].noteIndex
      });

    let data = {'toChange': JSON.stringify(toChange),
                'duration': duration};

    this.ajaxRequest(this.changeNoteDurationURL, data);
}

  /**changeVoice(value) {
    this.voiceIndex = voice;
    this.ajaxRequest(this.changeVoiceURL, {"voice":voice});
  }**/

  shakeScore(err){
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: err,
      buttons: ['Retry']
    });
    alert.present();
  }

  ajaxRequest(url, data, func=null) {
    this.selectedNotes = [];
    this.editorProvider.request(url, data)
      .subscribe(res => {
        if (func != null) {
          func(res);
        } else {
          this.composition = res;
          this.renderer.updateComposition(this.composition);
        }
      },
      (e) => {
        this.shakeScore(e);
        console.log(e);
      });
  }

  getNoteIndex (x, notes) {
    let index = 0;
    let difIndex = Math.abs(notes[index].getAbsoluteX()-x);
    for(let i=1; i<notes.length; i++) {
      let dif = Math.abs(notes[i].getAbsoluteX()-x);
      if(dif<difIndex) {
        index = i;
        difIndex = dif;
      }
    }
    return index;
  }

  getMeasureIndex (x) {
    for (let i = 0; i < this.renderer.measures.length; i++)
      if (x >= this.renderer.measures[i].staves[0].getX() && x <= this.renderer.measures[i].staves[0].getNoteEndX())
        return i;
  }

  getYFromClickEvent (e) {
    let y:any;
    let rect = this.canvas.getBoundingClientRect();
    y = e.clientY - rect.top;
    y = y.toFixed();
    let diff = y % 5;
    if (diff <= 2)
      y = y - diff;
    else
      y = y * 1 + (5 - diff);
    return y;
  }

  changeNoteSelection(value) {
    let selectedNotes = [];
    this.selectedNotes.forEach(function(item, index){
      let notes = this.renderer.measures[item.measureIndex].notes[item.voiceName][0];
      notes[item.noteIndex].setStyle({fillStyle: (typeof notes[item.noteIndex].oldStyle!=="undefined"?notes[item.noteIndex].oldStyle:"black")});
      let notePos = item;

      do {
        notePos = this.getCloseNote(notePos, value);
      } while(notePos.measureIndex>=0 && notePos.measureIndex<this.renderer.measures.length && notePos.noteIndex>=0 &&
        notePos.noteIndex<=this.renderer.measures[notePos.measureIndex].notes[item.voiceName][0].length &&
        this.renderer.measures[notePos.measureIndex].notes[item.voiceName][0][notePos.noteIndex].note_heads[0].style.fillStyle=="red");

      if(notePos.measureIndex>=0 && notePos.measureIndex<this.renderer.measures.length &&
        notePos.noteIndex>=0 && notePos.noteIndex<=this.renderer.measures[notePos.measureIndex].notes[item.voiceName][0].length) {
        selectedNotes.push({
          note: this.renderer.measures[notePos.measureIndex].notes[item.voiceName][0][notePos.noteIndex],
          voiceName: item.voiceName,
          index: item.index,
          measureIndex: notePos.measureIndex,
          noteIndex: notePos.noteIndex
        });
      }
    });

    this.selectedNotes = selectedNotes;
    this.selectedNotes.forEach(function(item, index){
      item.note.oldStyle = item.note.note_heads[0].style.fillStyle;
      item.note.setStyle({fillStyle: "blue"});
    });
    this.renderer.renderAndDraw();
  }

  calculatePitch (e) {
    let y = this.getYFromClickEvent(e);
    return this.getNote(y, this.renderer.measures[0].staves[this.renderer.measures[0].getStaveIndex(y)]);
  }

  getNote (y, stave) {
    let octave;
    let note;
    let bottom;

    if (stave.clef == "treble") {
      bottom = stave.getBottomLineY() + 15;
      note = 4; // c is 0, b is 6
      octave = 3;
    }
    else if (stave.clef == "bass") {
      bottom = stave.getBottomLineY();
      note = 2; // c is 0, b is 6
      octave = 2;
    }
    else if (stave.clef == "alto") {
      bottom = stave.getBottomLineY() + 15;
      note = 5; // c is 0, b is 6
      octave = 2;
    }

    for (let i = bottom; i >= bottom - 80; i -= 5) {
      if (i == y)
        break;
      if (note == 6) {
        note = 0;
        octave++;
      }
      else
        note++;
    }

    let notes = {0: 'c', 1: 'd', 2: 'e', 3: 'f', 4: 'g', 5: 'a', 6: 'b'};

    return notes[note] + '/' + octave;
  }

  getCloseNote(note, steps) {
    let note1, measureIndex, noteIndex, j, n = steps;

    for(let i=note.measureIndex;
        (steps>0 && n>0 && i<this.renderer.measures.length) || (steps<0 && n<0 && i>=0);
        (steps>0?i++:i--)) {
      if(i==note.measureIndex)
        j = note.noteIndex+steps;
      else (steps>0 ? j=0 : j=this.renderer.measures[i].notes[note.voiceName][this.voiceIndex].length-1);
      for(; (steps>0 && n>0 && j<this.renderer.measures[i].notes[note.voiceName][this.voiceIndex].length)
            || (steps<0 && n<0 && j>=0); (steps>0?j++:j--)) {
        note1 = this.renderer.measures[i].notes[note.voiceName][this.voiceIndex][j];
        if(note1.noteType=="n") {
          (steps>0 ? n-- : n++);
          if(n==0){
            measureIndex = i;
            noteIndex = j;
          }
        }
      }
    }

    return {
      note: note1,
      measureIndex: measureIndex,
      index: note.index,
      noteIndex: noteIndex,
      voiceName: note.voiceName
    };
  }

  /**exportMusicXML() {
    let a = document.createElement('a');
    a.setAttribute('download', 'music.xml');
    a.href = this.exportURL;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
  }**/

  private initUrls(){
    this.addNoteURL = this.config.rootUrlAPI + 'editor/note/add';
    this.deleteNotesURL = this.config.rootUrlAPI + 'editor/note/delete';
    this.addTieURL = this.config.rootUrlAPI + 'editor/note/tie/add';
    this.getCompositionURL = this.config.rootUrlAPI + 'editor/composition';
    this.accidentalUpdateURL = this.config.rootUrlAPI + 'editor/accidental';
    this.closeURL = this.config.rootUrlAPI + 'editor/close';
    //this.removeInstrumentURL = this.rootURLAPU +  '/instrument/remove';
    this.exportURL = this.config.rootUrlAPI + 'editor/exportxml';
    this.dotsUpdateURL = this.config.rootUrlAPI + 'editor/note/dot';
    this.moveNotesURL = this.config.rootUrlAPI + 'editor/note/move';
    this.setNoteAnnotationTextURL = this.config.rootUrlAPI + 'editor/note/annotation';
    this.changeNoteDurationURL = this.config.rootUrlAPI + 'editor/note/duration';
  }

  private initKeys(){
    this.imgPath = "./assets/imgs/";
    this.notes = new Map();
    this.notes.set("1", this.imgPath + "whole-note.png");
    this.notes.set("2", this.imgPath + "half-note.png");
    this.notes.set("4", this.imgPath + "quarter-note.png");
    this.notes.set("8", this.imgPath + "eighth-note.png");
    this.notes.set("16", this.imgPath + "sixteenth-note.png");
    this.notes.set("32", this.imgPath + "thirty-two.png");
    this.notes.set("64", this.imgPath + "sixty-fourth.png");
    this.notesKeys = Array.from(this.notes.keys());

    this.rests = new Map();
    this.rests.set("1r", this.imgPath + "whole-rest.png");
    this.rests.set("2r", this.imgPath + "half-rest.png");
    this.rests.set("4r", this.imgPath + "quarter-rest.png");
    this.rests.set("8r", this.imgPath + "eighth-rest.png");
    this.rests.set("16r", this.imgPath + "sixteenth-rest.png");
    this.rests.set("32r", this.imgPath + "thirty-two-rest.png");
    this.rests.set("64r", this.imgPath + "sixty-fourth-rest.png");
    this.restsKeys = Array.from(this.rests.keys());
    this.durationSelected = "1";

    this.accidentals = new Map();
    this.accidentals.set("clear", this.imgPath + "clear.png");
    this.accidentals.set("b", this.imgPath + "flat.png");
    this.accidentals.set("#", this.imgPath + "sharp.png");
    this.accidentals.set("n", this.imgPath + "restore.png");
    this.accidentalsKeys = Array.from(this.accidentals.keys());
    this.accidentalSelected = "clear";

    this.additional = new Map();
    this.additional.set("delete", this.imgPath + "delete.png");
    this.additional.set("tie", this.imgPath + "tie.png");
    this.additional.set("dot", this.imgPath + "dot.png");
    this.additional.set("double-dot", this.imgPath + "double-dot.png");
    this.additionalKeys = Array.from(this.additional.keys());


    this.voice = new Map();
    this.voice.set("0", 1);
    this.voice.set("1", 2);
    this.voiceKeys = Array.from(this.voice.keys());
  }

}
