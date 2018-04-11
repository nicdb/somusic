import { NgModule } from '@angular/core';
import { RendererDirective } from './renderer/renderer';
import { IonicModule } from "ionic-angular";
@NgModule({
	declarations: [RendererDirective],
	imports: [IonicModule],
	exports: [RendererDirective]
})
export class DirectivesModule {}
