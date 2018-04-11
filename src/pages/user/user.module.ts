import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPage } from './user';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    UserPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(UserPage),
  ],
})
export class UserPageModule {}
