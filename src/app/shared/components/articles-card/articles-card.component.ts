import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {ArticleRelatedType} from "../../../../types/article-related.type";

@Component({
  selector: 'app-articles-card',
  templateUrl: './articles-card.component.html',
  styleUrls: ['./articles-card.component.scss']
})
export class ArticlesCardComponent implements OnInit {

  @Input() article!: ArticleRelatedType;
  staticUrlImage: string = environment.serverStaticPath;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(){
      this.router.navigate(['/articles/' + this.article.url])
  }

}
