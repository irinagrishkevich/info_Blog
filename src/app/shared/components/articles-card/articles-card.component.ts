import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/article.type';

@Component({
  selector: 'app-articles-card',
  templateUrl: './articles-card.component.html',
  styleUrls: ['./articles-card.component.scss']
})
export class ArticlesCardComponent implements OnInit {

  @Input() article!: ArticleType;
  staticUrlImage: string = environment.serverStaticPath;
  constructor(private _snackBar: MatSnackBar,
              private router: Router,) { }

  ngOnInit(): void {
  }

  navigate(){
      this.router.navigate(['/product/' + this.article.url])

  }

}
