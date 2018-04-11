import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Assignment, Execution }  from "../../models/assignment";
import { AssignmentProvider } from "../../providers/assignment/assignment";

@IonicPage()
@Component({
  selector: 'page-assignment',
  templateUrl: 'assignment-details.html',
})
export class AssignmentPage implements OnInit{
  private isAdmin: boolean;
  private userId: number;
  private groupId: number;
  private assignment: Assignment;
  private executions: Execution[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public assignmentProvider: AssignmentProvider,
              public events: Events) {
    this.isAdmin = this.navParams.get("isAdmin");
    this.userId = this.navParams.get("userId");
    this.groupId = this.navParams.get("groupId");
    this.assignment = this.navParams.get("assignment");
    this.executions = [];

    this.events.subscribe("commentExecution:added", () => {
      this.getExecutions();
    })
  }

  ngOnInit(){
    this.getExecutions();
  }

  onExecution(execution: Execution){
    this.assignmentProvider.completeAssignment(execution.id, this.assignment.id)
      .subscribe(( ) => {
        this.assignmentProvider.getComposition()
          .subscribe((composition) => {
            this.navCtrl.push('EditorPage', {
              "composition": composition,
              "isAssignment": false,
              "isExecution": true,
              "isAdmin": this.isAdmin,
              "assignment": this.assignment,
              "executionId": execution.id
            })
          })
      });
  }

  onComment(execution: Execution){
    this.navCtrl.push('ExecutionCommentPage', {
      "execution": execution,
      "isAdmin": true,
    })
  }

  getExecutions(){
    this.assignmentProvider.getExecutions(Number(this.assignment.id))
      .subscribe(res => {
          this.executions = res;
      });
  }

  closeAssignment(){
    this.assignmentProvider.closeAssignment(this.assignment.id)
      .subscribe(( ) => {
        this.events.publish("assignment:closed");
        this.navCtrl.pop();
      });
  }

  removeAssignment(){
    this.assignmentProvider.removeAssignment(this.assignment.id)
      .subscribe(( ) => {
        this.events.publish("assignment:closed");
        this.navCtrl.pop();
      });
  }
}
