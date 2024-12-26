import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesCardComponent } from './components/articles-card/articles-card.component';
import {TextTransformPipe} from "./pipes/text-trasnform.pipe";
import { PopupComponent } from './components/popup/popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterModule} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import { LoaderComponent } from './components/loader/loader.component';
import {NgxMaskModule} from "ngx-mask";




@NgModule({
  declarations: [
    ArticlesCardComponent,
    TextTransformPipe,
    PopupComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgxMaskModule
  ],
  exports: [
    ArticlesCardComponent,
    TextTransformPipe,
    PopupComponent,
    LoaderComponent

  ]
})
export class SharedModule { }
