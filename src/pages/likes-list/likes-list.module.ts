import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LikesListPage } from './likes-list';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    LikesListPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(LikesListPage),
  ],
})
export class LikesListPageModule {}
