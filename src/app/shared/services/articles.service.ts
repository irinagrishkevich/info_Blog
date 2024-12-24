import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/article.type';
import { ActiveParamsType } from 'src/types/active-params.type';
import {ArticleRelatedType} from "../../../types/article-related.type";
import {ArticleResponseType} from "../../../types/article-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getArticlesTop(): Observable<ArticleRelatedType[]> {
    return this.http.get<ArticleRelatedType[]>(environment.api + 'articles/top');
  }

  getArticles(params: ActiveParamsType): Observable<ArticleResponseType> {
    return this.http.get<ArticleResponseType>(environment.api + 'articles', {
      params: params
    });
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  getRelatedArticle(url: string): Observable<ArticleRelatedType[]> {
    return this.http.get<ArticleRelatedType[]>(environment.api + 'articles/related/' + url);
  }





}
