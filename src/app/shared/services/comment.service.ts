
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentActionType} from "../../../types/comment-action.type";
import {CommentsType} from "../../../types/comments.type";
import { CommentParamType } from 'src/types/comment-param.type';
import { ActionEnum } from 'src/types/action.type';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getComments(params: CommentParamType): Observable<CommentsType> {
    return this.http.get<CommentsType>(environment.api + 'comments', { params });
  }

  addComments(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text, article
    });
  }

  applyAction(urlComment: string, action: ActionEnum): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + "comments/" + urlComment + "/apply-action", {
      action
    });
  }

  getActionForComment(urlComment: string): Observable<CommentActionType[] | DefaultResponseType> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.api + "comments/" + urlComment + "/actions");
  }

  getArticleCommentActionsForUser(urlArticle: string): Observable<CommentActionType[] | DefaultResponseType> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.api + "comments/article-comment-actions");

  }

}
