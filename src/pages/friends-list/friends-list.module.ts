import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendsListPage } from './friends-list';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    FriendsListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FriendsListPage),
  ],
})
export class FriendsListPageModule {}
