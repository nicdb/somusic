import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Composition } from "../../models/composition";
import { ConfigProvider } from "../config/config";

@Injectable()
export class CompositionProvider{

  constructor(private http: HttpClient,
              private config: ConfigProvider) {}

  getCompositions(id: string){
    return this.http.get<Composition[]>(this.config.rootUrlAPI + 'myspace/' + id + '/composition');
  }

  setComposition(composition: Composition){
    let data = {"composition": JSON.stringify(composition)};

    return this.http.post<Composition>(this.config.rootUrlAPI + "editor/composition/set", data);
  }

  addComposition(){
    let data = {};
    return this.http.post<boolean>(this.config.rootUrlAPI + "myspace/addscore", data);
  }

  share(compositionId: string){
    let data = {"scoreId": compositionId};

    return this.http.post<boolean>(this.config.rootUrlAPI + "myspace/sharescore", data);
  }

  remove(compositionId: string){
    let data = {"scoreId": compositionId};

    return this.http.post<boolean>(this.config.rootUrlAPI + "myspace/removescore", data);
  }

  commitComposition(name: string, timeSignature: string, keySignature: string, instrumentsUsed: any){
    let data = {'name': name,
                'timeSignature': timeSignature,
                'keySignature': keySignature,
                'instrumentsUsed': instrumentsUsed};

    return this.http.post<Composition>(this.config.rootUrlAPI + 'editor/init', data);
  }

  getComposition(id: string){
    return this.http.get<Composition>(this.config.rootUrlAPI + 'editor/composition/' + id);
  }
}
