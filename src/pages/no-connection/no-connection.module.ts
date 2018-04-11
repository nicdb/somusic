import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoConnectionPage } from './no-connection';

@NgModule({
  declarations: [
    NoConnectionPage,
  ],
  imports: [
    IonicPageModule.forChild(NoConnectionPage),
  ],
})
export class NoConnectionPageModule {}
