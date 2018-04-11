import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExecutionDetailsPage } from './assignment-execution-details';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    ExecutionDetailsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ExecutionDetailsPage),
  ],
})
export class ExecutionDetailsPageModule {}
