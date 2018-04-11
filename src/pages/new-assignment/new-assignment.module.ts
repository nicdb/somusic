import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewAssignmentPage } from './new-assignment';

@NgModule({
  declarations: [
    NewAssignmentPage,
  ],
  imports: [
    IonicPageModule.forChild(NewAssignmentPage),
  ],
})
export class NewAssignmentPageModule {}
