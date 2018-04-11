export interface Composition {
  id: string;
  user_c: string;
  timestamp_c: any;
  name: string;
  user_m: string;
  timestamp_m: any;
  instrumentsScore: InstrumentScore[];
  instrumentsUsed: InstrumentUsed[];
}

export interface InstrumentScore {
  default_clef: string;
  name: string;
  measures: Measure[];
  ties: string[];
  instrument: string;
  user: string;
}

export interface InstrumentUsed {
  labelName: string;
  name: string;
  scoresClef: string[];
  braces: string[];
  user: string;
}

export interface Measure {
  clef: string;
  keySignature: string;
  timeSignature: string;
  voices: Voice[];
}

export interface Voice {
  duration: any;
  step: string[];
  octave: string[];
  accidental: string[];
  isTieStart: any;
  isTieEnd: any;
  dots: any;
  text: any;
  color: string;
}
