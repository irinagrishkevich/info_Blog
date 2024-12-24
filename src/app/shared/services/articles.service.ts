import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/article.type';
import { ActiveParamsType } from 'src/types/active-params.type';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getArticlesTop(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getAllArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles');
  }

  getArticles(params: ActiveParamsType): Observable<{ count: number; pages: number; items: ArticleType[] }> {
    const queryParams = new URLSearchParams();
    if (params.page){
      queryParams.set('page', params.page.toString())
    }
    if (params.categories.length > 0){
      queryParams.set('categories', params.categories.join(','))
    }
    return this.http.get<{ count: number; pages: number; items: ArticleType[] }>(environment.api + 'articles?' + queryParams.toString());
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles' + url);
  }



}
