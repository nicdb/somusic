import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewCompositionMultiPage } from './new-composition-multi';

@NgModule({
  declarations: [
    NewCompositionMultiPage,
  ],
  imports: [
    IonicPageModule.forChild(NewCompositionMultiPage),
  ],
})
export class NewCompositionMultiPageModule {}
