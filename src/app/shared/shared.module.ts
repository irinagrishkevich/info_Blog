import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesCardComponent } from './components/articles-card/articles-card.component';
import {TextTransformPipe} from "./pipes/text-trasnform.pipe";



@NgModule({
  declarations: [
    ArticlesCardComponent,
    TextTransformPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ArticlesCardComponent,
    TextTransformPipe
  ]
})
export class SharedModule { }
