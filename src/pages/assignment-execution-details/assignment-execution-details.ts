import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Assignment, Execution } from "../../models/assignment";
import { CompositionProvider } from "../../providers/composition/composition";
import { AssignmentProvider } from "../../providers/assignment/assignment";

@IonicPage()
@Component({
  selector: 'page-execution-details',
  templateUrl: 'assignment-execution-details.html',
})
export class ExecutionDetailsPage {
  private isAdmin : boolean;
  private execution : Execution;
  private assignment: Assignment;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public compositionProvider: CompositionProvider,
              public assignmentProvider: AssignmentProvider) {
    this.isAdmin    = this.navParams.get("isAdmin");
    this.execution  = this.navParams.get("execution");
    this.assignment = this.navParams.get("assignment");
  }

  onEdit(){
    if(this.execution.id != null) {
      this.assignmentProvider.completeAssignment(this.execution.id, this.assignment.id)
        .subscribe(() => {
          this.assignmentProvider.getComposition()
            .subscribe((composition) => {
              this.navCtrl.push('EditorPage', {
                "composition": composition,
                "isAssignment": false,
                "isExecution": true,
                "execution":  0,
                "isAdmin":   this.isAdmin,
                "assignment":  this.assignment
              })
            })
        })
    } else {
      this.assignmentProvider.completeAssignment(null, this.assignment.id)
        .subscribe(() => {
          this.assignmentProvider.getComposition()
            .subscribe((composition) => {
              this.navCtrl.push('EditorPage', {
                "composition": composition,
                "isAssignment": false,
                "isExecution": true,
                "execution": -1,
                "isAdmin": this.isAdmin,
                "assignment": this.assignment
              })
            })
        })
    }
  }

  newEdit(){
    this.assignmentProvider.completeAssignment(null, this.assignment.id)
      .subscribe(() => {
        this.assignmentProvider.getComposition()
          .subscribe((composition) => {
            this.navCtrl.push('EditorPage', {
              "composition": composition,
              "isAssignment": false,
              "isExecution": true,
              "execution":  -1,
              "isAdmin":   this.isAdmin,
              "assignment":  this.assignment
            })
          })
      })
  }

}
