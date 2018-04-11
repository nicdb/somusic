import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Composition } from "../../models/composition";

@Injectable()
export class EditorProvider {

  constructor(private http: HttpClient) {}

  request(url: string, data: any){
    return this.http.post<Composition>(url, data);
  }
}
