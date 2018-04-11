import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupCommentsPage } from './group-comments';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    GroupCommentsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GroupCommentsPage),
  ],
})
export class GroupCommentsPageModule {}
