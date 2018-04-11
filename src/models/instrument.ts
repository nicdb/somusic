export interface Instrument {
   name: string;
   id_group: string;
   scoresClef: string;
   braces: string;
   id: string;
}

export interface InstrumentsGroup {
   name: string;
   instruments: InstrumentGroup[];
   id: string;
}

export interface InstrumentGroup {
   name: string;
   optionValue: string;
}
