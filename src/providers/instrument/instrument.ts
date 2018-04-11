import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Instrument } from "../../models/instrument";
import { ConfigProvider } from "../config/config";

@Injectable()
export class InstrumentProvider {

  constructor(private http: HttpClient,
              private config: ConfigProvider){}

  getInstruments(){
    return this.http.get<Instrument[]>(this.config.rootUrlAPI + 'instrument')
  }
}
