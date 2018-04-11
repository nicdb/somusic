import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupsPage } from './groups';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    GroupsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GroupsPage),
  ],
})
export class GroupsPageModule {}
