import * as Vex from 'vexflow';


export default class Measure {
  public index;
  public notes;
  public staves;
  public beatNum;
  public beatValue;
  public keySign;
  public instrumentsUsed;
  public instruments;
  public instrumentsName;
  public width;

  constructor(index, beatNum, beatValue, keySign, instrumentsUsed){
    this.index = index;
    this.notes = [];
    this.staves = [];
    this.beatNum = beatNum;
    this.beatValue = beatValue;
    this.keySign = keySign;
    this.instrumentsUsed = instrumentsUsed;
    this.instrumentsName = this.getInstrumentsName(this.instrumentsUsed);
    this.instruments = [];
    for (var i = 0; i < this.instrumentsName.length; i++) {
      this.notes[this.instrumentsName[i]] = [[]];
      this.instruments[this.instrumentsName[i]] = [
        new Vex.Flow.Voice({
          num_beats: this.beatNum, beat_value: this.beatValue,
          resolution: Vex.Flow.RESOLUTION
        })
      ];
      this.instruments[this.instrumentsName[i]][0].setMode(3);
      /*setMode(3) allows to insert notes inside the measure even if the measure is not complete, but
       throws an exception if the duration of the inserted notes exceeds the time signature*/
    }
    this.width;
    this.computeScale();
  };

  getInstrumentsName(instrumentsUsed) {
    let toReturn = [];
    for (let i = 0; i < instrumentsUsed.length; i++) {
      let instrument = instrumentsUsed[i];
      let label = instrument.labelName;
      for (let j = 0; j < instrument.scoresClef.length; j++)
        toReturn.push(label + "#score" + j);
    }
    return toReturn;
  };

  addNote(note, instrumentName, index, nVoice) {
    while (this.notes[instrumentName].length <= nVoice) {
      this.notes[instrumentName].push([]);
      this.instruments[instrumentName]=(new Vex.Flow.Voice({
        num_beats: this.beatNum, beat_value: this.beatValue,
        resolution: Vex.Flow.RESOLUTION
      }));
    }
    this.notes[instrumentName][nVoice].splice(index, 0, note);
    try {
      this.instruments[instrumentName][nVoice] = new Vex.Flow.Voice({
        num_beats: this.beatNum, beat_value: this.beatValue,
        resolution: Vex.Flow.RESOLUTION
      }).setMode(3);
      this.instruments[instrumentName][nVoice].addTickables(this.notes[instrumentName][nVoice]);
    }
    catch (err) {
      console.log(err);
      this.notes[instrumentName].splice(index, 1);
      this.instruments[instrumentName] = new Vex.Flow.Voice({
        num_beats: this.beatNum, beat_value: this.beatValue,
        resolution: Vex.Flow.RESOLUTION
      }).setMode(3);
      this.instruments[instrumentName].addTickables(this.notes[instrumentName]);
    }
  };

  render(ctx, x) {
    this.computeScale();
    let k = 0;
    this.staves = [];
    let braces = [];
    let lines = [];
    for (let i = 0; i < this.instrumentsUsed.length; i++) {
      let inst = this.instrumentsUsed[i];
      let start = k * 80 + 130;
      let end = start;
      for (let j = 0; j < inst.scoresClef.length; j++, k++) {
        end = k * 80;
        let stave = new Vex.Flow.Stave(x, end, this.width);
        if (this.index == 0)
          stave.addClef(inst.scoresClef[j])
            .addKeySignature(this.keySign)
            .addTimeSignature(this.beatNum + "/" + this.beatValue);
        this.staves.push(stave);
      }
      if (this.index == 0) {
        ctx.fillText(inst.labelName, 10, (start + end) / 2);
        if (typeof inst.braces !== "undefined")
          for (let j = 0; j < inst.braces.length; j++)
            braces.push(new Vex.Flow.StaveConnector(this.staves[k - inst.scoresClef.length + parseInt(inst.braces[j][0])], this.staves[k - inst.scoresClef.length + parseInt(inst.braces[j][1])]).setType(3));
      }
    }
    this.staves[0].setContext(ctx).draw();
    for (let i = 1; i < this.staves.length; i++) {
      this.staves[i].setContext(ctx).draw();
      lines.push(new Vex.Flow.StaveConnector(this.staves[i - 1], this.staves[i]).setType(1));
    }
    for (let i = 0; i < braces.length; i++)
      braces[i].setContext(ctx).draw();
    for (let i = 0; i < lines.length; i++)
      lines[i].setContext(ctx).draw();
  };

  renderEndLine(ctx) {
    new Vex.Flow.StaveConnector(this.staves[0], this.staves[0]).setType(6).setContext(ctx).draw();
    for (let i = 1; i < this.staves.length; i++)
      new Vex.Flow.StaveConnector(this.staves[i - 1], this.staves[i]).setType(6).setContext(ctx).draw();
  };

  computeScale() {
    let widths = [];
    for (let instrumentName in this.notes)
      widths[instrumentName] = 70;
    for (let instrumentName in this.notes) {
      for (let i = 0; i < this.notes[instrumentName].length; i++) {
        let width = 0;
        for (let j = 0; j < this.notes[instrumentName][i].length; j++) {
          let noteDuration = this.notes[instrumentName][i][j].duration;
          if (isNaN(noteDuration.charAt(noteDuration.length - 1)))
            noteDuration = parseInt(noteDuration.substring(0, noteDuration.length - 1));
          else
            noteDuration = parseInt(noteDuration);
          width += (noteDuration > 8 ? noteDuration: 2 * noteDuration);
          width += (noteDuration < 16 ? noteDuration: noteDuration / 2);
          let noteModifiers = this.notes[instrumentName][i][j].modifiers;
          for (let k = 0; k < noteModifiers.length; k++)
            width += noteModifiers[k].width;
        }
        if (widths[instrumentName] < (width + 70))
          widths[instrumentName] = width + 70;
      }
    }
    this.width = 80;
    for (let instrumentName in this.notes)
      if (this.width < widths[instrumentName])
        this.width = widths[instrumentName];
    if (this.index == 0)
      this.width += 60 + this.getArmatureAlterations() * 20;
  };

  getEndX() {
    return this.staves[0].getX() + this.staves[0].getWidth();
  };

  drawNotes(ctx) {
    this.computeScale();
    for (let instrumentName in this.instruments) {
      for (let i = 0; i < this.instruments[instrumentName].length; i++) {
        let fillStyles = [];
        for (let j = 0; j < this.instruments[instrumentName][i].tickables.length; j++) {
          let note = this.instruments[instrumentName][i].tickables[j];
          fillStyles[j] = [];
          for (let k = 0; k < note.note_heads.length; k++)
            fillStyles[j][k] = (typeof note.note_heads[k].style !== "undefined" ? note.note_heads[k].style : "");
        }
        var beams = Vex.Flow.Beam.generateBeams(this.instruments[instrumentName][i].tickables);
        for (let j = 0; j < this.instruments[instrumentName][i].tickables.length; j++) {
          for (let k = 0; k < this.instruments[instrumentName][i].tickables[j].note_heads.length; k++) {
            this.instruments[instrumentName][i].tickables[j].note_heads[k].style = fillStyles[j][k];
            //this.instruments[instrumentName][i].tickables[j].note_flags[k].style = "black";
          }
        }
      }
      //Vex.Flow.Formatter.FormatAndDraw(ctx,  this.getStaveToDraw(instrumentName), this.instruments[instrumentName][0].tickables);
      let width = this.width;
      if (this.index == 0)
        width -= (60 + this.getArmatureAlterations() * 20);
      width -= 20;
      new Vex.Flow.Formatter().joinVoices(this.instruments[instrumentName]).format(this.instruments[instrumentName], width);
      let measure = this;
      this.instruments[instrumentName].forEach(function (v) { v.draw(ctx, measure.getStaveToDraw(instrumentName)); });
      beams.forEach(function (b) {
        /**b.setStyle({
          fillStyle: 'black',
          strokeStyle: 'black'
        });**/
        b.setContext(ctx).draw();
      });
    }
  };

  getStaveToDraw(instrumentName) {
    let str = instrumentName.split("#score");
    let n = 0;
    for (let i = 0; i < this.instrumentsUsed.length; i++) {
      let instrument = this.instrumentsUsed[i];
      if (str[0] == instrument.labelName)
        return this.staves[n + parseInt(str[1])];
      n += instrument.scoresClef.length;
    }
  };

  getStaveIndex(height) {
    let scoreClose = -1;
    let scoreCloseDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < this.staves.length; i++) {
      let stave = this.staves[i];
      let dist = Math.abs(stave.getYForLine(2) - height);
      if (dist < scoreCloseDist) {
        scoreCloseDist = dist;
        scoreClose = i;
      }
    }
    return scoreClose;
  };

  getArmatureAlterations() {
    switch (this.keySign) {
      case "C":
      case "Am":
        return 0;
      case "G":
      case "Em":
      case "F":
      case "Dm":
        return 1;
      case "D":
      case "Bm":
      case "Bb":
      case "Gm":
        return 2;
      case "A":
      case "F#m":
      case "Eb":
      case "Cm":
        return 3;
      case "E":
      case "C#m":
      case "Ab":
      case "Fm":
        return 4;
      case "B":
      case "G#m":
      case "Db":
      case "Bbm":
        return 5;
      case "F#":
      case "D#m":
      case "Gb":
      case "Ebm":
        return 6;
      case "C#":
      case "A#m":
      case "Cb":
      case "Abm":
        return 7;
    }
  };
}
