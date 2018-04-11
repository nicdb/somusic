import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompositionsPage } from './compositions';
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    CompositionsPage,
  ],
  imports: [
    DirectivesModule,
    IonicPageModule.forChild(CompositionsPage),
  ],
})
export class CompositionsPageModule {}
