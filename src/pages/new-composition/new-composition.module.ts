import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewCompositionPage } from './new-composition';

@NgModule({
  declarations: [
    NewCompositionPage,
  ],
  imports: [
    IonicPageModule.forChild(NewCompositionPage),
  ],
})
export class NewCompositionPageModule {}
