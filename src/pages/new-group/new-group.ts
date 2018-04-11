import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupsProvider } from "../../providers/groups/groups";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage {
  public groupForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public groupProvider: GroupsProvider,
              public events: Events,
              public formBuilder: FormBuilder) {
    this.groupForm = formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  newGroup() {
    this.groupProvider.newGroup(this.groupForm.value.title, this.groupForm.value.description)
      .subscribe(
        () => {},
        () => {},
        () => {
          this.events.publish('group:new');
          this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()-2));
        });
  }

}
