import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupUsersListPage } from './group-users-list';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    GroupUsersListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GroupUsersListPage),
  ],
})
export class GroupUsersListPageModule {}
