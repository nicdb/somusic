import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditorPage } from './editor';

@NgModule({
  declarations: [
    EditorPage,
  ],
  imports: [
    IonicPageModule.forChild(EditorPage),
  ],
  exports: [
    EditorPage
  ]
})
export class EditorPageModule {}
