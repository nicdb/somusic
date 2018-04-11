import Measure from "./Measure";
import * as Vex from 'vexflow';

export default class Renderer {
  public canvas;
  public measures;
  public renderer;
  public ties;
  public totNScores;
  public composition;
  public isEditor:boolean;

  constructor(canvas, instrumentsUsed, isEditor = false) {
    let renderer = this;
    this.canvas = canvas;
    this.renderer = new Vex.Flow.Renderer(this.canvas, Vex.Flow.Renderer.Backends.CANVAS);
    this.measures = [];
    this.ties = [];
    this.totNScores = 0;
    this.isEditor = isEditor;
    instrumentsUsed.forEach(function (element, index) {
      renderer.totNScores += element["scoresClef"].length;
    });
  }

  updateComposition(data) {
    let instrumentsScore = data.instrumentsScore;
    this.composition = data;
    this.measures = [];
    this.ties = [];
    for (let i = 0; i < instrumentsScore[0].measures.length; i++) {
      let timeSignature = instrumentsScore[0].measures[i].timeSignature.split("/");
      let m = new Measure(i, timeSignature[0], timeSignature[1], instrumentsScore[0].measures[0].keySignature, data.instrumentsUsed);
      for (let j = 0; j < instrumentsScore.length; j++) {
        let m1 = instrumentsScore[j].measures[i];
        //console.log(i, j, m1.voices);
        if (m1.voices.length == 0)
          continue;
        for (let voiceIndex = 0; voiceIndex < m1.voices.length; voiceIndex++) {
          for (let k = 0; k < m1.voices[voiceIndex].length; k++) {
            let note = m1.voices[voiceIndex][k];
            let keys = [];
            let duration;
            for (let l = 0; l < note.step.length; l++)
              keys[l] = note.step[l] + "/" + note.octave[l];
            if (note.step.length == 0) {
              if (m1.clef == "treble") {
                if (m1.voices.length > 1 && voiceIndex == 0)
                  keys[voiceIndex] = "f/5";
                else if (m1.voices.length > 1 && voiceIndex == 1)
                  keys[voiceIndex] = "e/4";
                else
                  keys[voiceIndex] = "b/4";
              }
              else if (m1.clef == "bass") {
                if (m1.voices.length > 1 && voiceIndex == 0)
                  keys[voiceIndex] = "a/3";
                else if (m1.voices.length > 1 && voiceIndex == 1)
                  keys[voiceIndex] = "g/2";
                else
                  keys[voiceIndex] = "d/3";
              }
              else if (m1.clef == "alto") {
                if (m1.voices.length > 1 && voiceIndex == 0)
                  keys[voiceIndex] = "g/4";
                else if (m1.voices.length > 1 && voiceIndex == 1)
                  keys[voiceIndex] = "f/3";
                else
                  keys[voiceIndex] = "c/4";
              }
            }
            if (note.dots > 0)
              duration = 64 / (note.duration * (2 * note.dots) / (Math.pow(2, note.dots + 1) - 1));
            else
              duration = 64 / note.duration;
            let note1 = new Vex.Flow.StaveNote({
              clef: m1.clef,
              keys: keys,
              duration: duration + (note.step.length == 0 ? "r" : "")
            });
            if (note.accidental != null)
              for (let l = 0; l < note.accidental.length; l++)
                if (note.accidental[l] != "clear")
                  note1.addAccidental(l, new Vex.Flow.Accidental(note.accidental[l]));
            if (note.text != null)
              note1.addModifier(0, new Vex.Flow.Annotation(note.text).setVerticalJustification(Vex.Flow.Annotation.VerticalJustify.TOP));
            for (let d = 0; d < note.dots; d++)
              note1.addDotToAll();
            if(note.color!=null) {
              note1.setStyle({fillStyle: note.color, strokeStyle: 'black'});
              //note1.setFlagStyle({ fillStyle: 'black', strokeStyle: 'black' });
              /**if (note.color.includes("red")){
                note1.setStyle({fillStyle: "red"});
              } else if (note.color.includes("blue")){
                note1.setStyle({fillStyle: "blue"});
              } else {
                note1.setStyle({fillStyle: "black"});
              }**/
            } else {
              note1.setStyle({fillStyle: "black"});
            }
            m.addNote(note1, instrumentsScore[j].name, k, voiceIndex);
          }
        }
      }
      this.measures.push(m);
    }
    for (let i = 0; i < instrumentsScore.length; i++) {
      let instrumentScore = instrumentsScore[i];
      for (let j = 0; j < instrumentScore.ties.length; j++) {
        let tie = instrumentScore.ties[j];
        this.ties.push([new Vex.Flow.StaveTie({
          first_note: this.measures[tie.firstMeasure].notes[instrumentScore.name][tie.voiceIndex][tie.firstNote],
          last_note: this.measures[tie.lastMeasure].notes[instrumentScore.name][tie.voiceIndex][tie.lastNote]
        }), instrumentScore.name, tie.firstMeasure, tie.firstNote, tie.lastMeasure, tie.lastNote]);
      }
    }
    this.renderAndDraw();
  }

  renderAndDraw() {
    let ctx = this.renderer.getContext();
    ctx.clear();
    this.renderMeasures();
    for (let i = 0; i < this.measures.length; i++)
      this.measures[i].drawNotes(this.renderer.getContext());
    this.ties.forEach(function (t) {
      t[0].setContext(ctx).draw();
    });
  }

  renderMeasures() {
    let size = 0;
    for (let i = 0; i < this.measures.length; i++) {
      this.measures[i].computeScale();
      size += this.measures[i].width;
    }
    let ctx = this.renderer.getContext();
    this.renderer.resize(size + 150, 20 + this.totNScores * 90);
    /**if(!this.isEditor) {
      ctx.scale(1, 1);
    } else if (this.isEditor){
      ctx.scale(1, 1);
    }**/
    ctx.clear();
    this.measures[0].render(ctx, 100);
    for (let i = 1; i < this.measures.length; i++)
      this.measures[i].render(ctx, this.measures[i - 1].getEndX());
    this.measures[this.measures.length - 1].renderEndLine(ctx);
  }

}
