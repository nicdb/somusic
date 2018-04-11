import 'rxjs/add/operator/map';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Storage } from '@ionic/storage';
import { Composition } from "../../models/composition";
import { Assignment, Execution } from "../../models/assignment";
import { ConfigProvider } from "../config/config";

@Injectable()
export class AssignmentProvider {

  constructor(private http: HttpClient,
              public storage:Storage,
              private config: ConfigProvider) {}

  getAssignments(idGroup: number){
    return this.http.get<Assignment[]>(this.config.rootUrlAPI + 'assignment/' + idGroup);
  }

  newAssignment(groupId: number, name: string, isMultiUser: boolean){
    let data = {'isMultiUser': Number(isMultiUser),
                'name': name,
                'groupId': groupId};

    return this.http.post<string>(this.config.rootUrlAPI + 'assignment/new', data);
  }

  saveNewAssignment(){
    return this.http.post(this.config.rootUrlAPI + 'assignment/save', {});
  }

  completeAssignment(executionId: number, assignmentId: number){
    let data = {};
    if(executionId!=null)
      data = {'executionId': executionId,
              'assignmentId': assignmentId};
    else
      data = {'assignmentId': assignmentId};

    return this.http.post(this.config.rootUrlAPI + 'assignment/complete', data);
  }

  closeAssignment(id: number){
    let data = {'id': id};

    return this.http.post<string>(this.config.rootUrlAPI + 'assignment/close', data);
  }

  removeAssignment(id: number){
    let data = {'id': id};

    return this.http.post<string>(this.config.rootUrlAPI + 'assignment/remove', data);
  }

  getExecutions(idAssignment:number){
    return this.http.get<Execution[]>(this.config.rootUrlAPI + 'assignment/execution/' + idAssignment);
  }

  getExecutionsByUser(idAssignment:number, idUser:number){
    return this.http.get<Execution>(this.config.rootUrlAPI + 'assignment/execution/' + idAssignment + '/' + idUser);
  }

  commitExecution(id: number){
    let data = {'assignmentId': id};

    return this.http.post(this.config.rootUrlAPI + 'assignment/commit', data);
  }

  editExecution(id: number){
    let data = {'executionId': id};

    return this.http.post(this.config.rootUrlAPI + 'assignment/edit', data);
  }

  makeCorrection(id: number, composition: Composition){
    let data = {'executionId': id,
                'composition': JSON.stringify(composition)};

    return this.http.post(this.config.rootUrlAPI + 'assignment/correction', data);
  }

  saveComment(id: number, post: string){
    let data = {'id': id,
                'comment': post};

    return this.http.post(this.config.rootUrlAPI + 'assignment/comment/save', data);
  }

  getComposition(){
    return this.http.post<Composition>(this.config.rootUrlAPI + 'editor/composition', {});
  }
}
