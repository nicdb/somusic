import { Component, Input, OnInit } from '@angular/core';
import { AlertController, Events, NavController, NavParams } from "ionic-angular";
import { Assignment } from "../../models/assignment";
import { AssignmentProvider } from "../../providers/assignment/assignment";

@Component({
  selector: 'assignment',
  templateUrl: 'assignments.html'
})
export class AssignmentComponent implements OnInit{
  @Input("isAdmin") isAdmin: boolean;
  @Input("userId")  userId : number;
  @Input("groupId") groupId: number;
  private assignments: Assignment[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public assignmentProvider: AssignmentProvider,
              public events: Events) {
    this.assignments = [];

    this.events.subscribe("assignment:closed", () => {
      this.getAssignments();
    });
    this.events.subscribe("assignment:new", () => {
      this.getAssignments();
    });
  }

  ngOnInit(){
    this.getAssignments();
  }

  onAssignment(assignment: Assignment) {
    if (this.isAdmin && assignment.isMultiUser == 0) {
      this.navCtrl.push('AssignmentPage', {
        "isAdmin" :  this.isAdmin,
        "userId" :   this.userId,
        "groupId" :  this.groupId,
        "assignment": assignment
      });
    } else if (assignment.isMultiUser == 1){
      this.assignmentProvider.completeAssignment(null, assignment.id)
        .subscribe(() => {
          this.assignmentProvider.getComposition()
            .subscribe((composition) => {
              this.navCtrl.push('EditorPage', {
                "composition" : composition,
                "isAssignment": false,
                "isExecution" : true,
                "isAdmin" :   false,
                "assignment" :  assignment
              })
            })
        })
    }
  }

  onDetails(assignment: Assignment){
    this.navCtrl.push('AssignmentPage', {
      "isAdmin" :  this.isAdmin,
      "userId" :   this.userId,
      "groupId" :  this.groupId,
      "assignment": assignment
    });
  }

  onEdit(assignment: Assignment){
    this.assignmentProvider.getExecutionsByUser(Number(assignment.id), this.userId)
      .subscribe((execution) => {
        this.navCtrl.push('ExecutionDetailsPage', {
          "execution" : execution,
          "assignment": assignment,
          "isAdmin" :  this.isAdmin
        })
      })
  }

  getAssignments(){
    this.assignmentProvider.getAssignments(this.groupId)
      .subscribe(res => {
          this.assignments = res.reverse();
        }, (error) => {
          this.presentAlert(error.message);
        });
  }

  presentAlert(error:string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
