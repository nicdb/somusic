import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupInvitesListPage } from './group-invites-list';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    GroupInvitesListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GroupInvitesListPage),
  ],
})
export class GroupInvitesListPageModule {}
