import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AssignmentProvider } from "../../providers/assignment/assignment";
import { Execution } from "../../models/assignment";

@IonicPage()
@Component({
  selector: 'page-execution-comment',
  templateUrl: 'assignment-execution-comment.html',
})
export class ExecutionCommentPage {
  private execution: Execution;
  private isAdmin: boolean;
  private comment: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public assignmentProvider: AssignmentProvider,
              public events: Events) {
    this.comment = "";
    this.execution = this.navParams.get("execution");
    this.isAdmin = this.navParams.get("isAdmin");
  }

  saveComment(){
    this.assignmentProvider.saveComment(this.execution.id, this.comment)
      .subscribe(
        () => {
          this.events.publish("commentExecution:added");
          this.navCtrl.pop();
        }
      )
  }
}
