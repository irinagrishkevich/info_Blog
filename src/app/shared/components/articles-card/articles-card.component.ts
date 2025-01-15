import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {ArticleRelatedType} from "../../../../types/article-related.type";

@Component({
  selector: 'app-articles-card',
  templateUrl: './articles-card.component.html',
  styleUrls: ['./articles-card.component.scss']
})
export class ArticlesCardComponent {

  @Input() article!: ArticleRelatedType;
  staticUrlImage: string = environment.serverStaticPath;
  constructor(private router: Router) { }

  navigate(){
      this.router.navigate(['/articles/' + this.article.url])
  }

}
