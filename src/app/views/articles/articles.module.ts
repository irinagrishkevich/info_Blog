import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailComponent } from './detail/detail.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CatalogComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule
  ]
})
export class ArticlesModule { }
