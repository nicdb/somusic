import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Composition } from "../../models/composition";
import Renderer from "../../assets/js/somusic/Renderer";

@Directive({
  selector: '[renderer]'
})
export class RendererDirective implements OnInit {
  @Input('renderer') composition: Composition;
  canvas: any;

  constructor(el: ElementRef) {
    this.canvas = el.nativeElement;
  }

  ngOnInit(){
    let renderer = new Renderer(this.canvas, this.composition.instrumentsUsed, false);
    renderer.updateComposition(this.composition);
  }

}
