import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupPage } from './group';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    GroupPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GroupPage),
  ],
})
export class GroupPageModule {}
