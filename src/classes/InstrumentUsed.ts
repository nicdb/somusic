import { Instrument } from "../models/instrument";
import { User } from "../models/social";

export default class InstrumentUsed{
  instrument: Instrument;
  labelName: string;
  user: User;
  userSelected: User;

  constructor(instrument: Instrument, labelName: string, user: User = null){
    this.instrument = instrument;
    this.user = user;
    this.userSelected = user;
    this.labelName = labelName;
  }
}
