import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges
} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "src/app/core/auth.service";
import {CommentsService} from "src/app/shared/services/comment.service";
import {environment} from "src/environments/environment";
import {ActionEnum} from "src/types/action.type";
import {ArticleRelatedType} from "src/types/article-related.type";
import {ArticleType} from "src/types/article.type";
import {CommentParamType} from "src/types/comment-param.type";
import {CommentType} from "src/types/comment.type";
import {DefaultResponseType} from "src/types/default-response.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {CommentsType} from "../../../../types/comments.type";
import {CommentActionType} from "src/types/comment-action.type";


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit {

  staticUrlImage: string = environment.serverStaticPath;

  params: CommentParamType | null = null;

  article!: ArticleType;
  relatedArticles: ArticleRelatedType[] = [];
  isLogged: boolean = false;

  urlParams!: string;
  articleUrl: string = '';

  comments!: CommentType[];
  commentsCount: number | null = null;
  commentForm = this.fb.group({
    text: ['', Validators.required]
  });

  action: typeof ActionEnum = ActionEnum;



  constructor(private fb: FormBuilder,
              private articleService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private commentsService: CommentsService,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private cdRef: ChangeDetectorRef,
              private el: ElementRef,
              private renderer: Renderer2) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.urlParams = params['url'];
      this.params = null;
      this.loadPage();
    });
    this.articleService.getRelatedArticle(this.urlParams)
      .subscribe((data: ArticleRelatedType[]) => {
        this.relatedArticles = data;
      })

    this.articleUrl = encodeURIComponent(this.urlParams);
  }
  ngAfterViewInit() {
    const content = this.el.nativeElement.querySelector('.details-info-left-text');
    if (content) {
      this.renderer.addClass(content, 'custom-style');
    }
  }

  loadPage() {
    this.articleService.getArticle(this.urlParams)
      .subscribe((data: ArticleType) => {
        this.article = data;
        this.comments = this.article.comments;
        this.commentsCount = this.article.commentsCount;
        this.likeAndDislikeComments();
        this.cdRef.detectChanges();
      });
  }

  addNewComment() {
    if (this.commentForm.valid && this.commentForm.value.text) {

      this.commentsService.addComments(this.commentForm.value.text, this.article.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error && data.message) {
            this._snackBar.open(data.message);
            this.commentForm.reset()
          } else {
            this.commentForm.reset();
            this.loadPage();
          }
        });
    }
  }
  loadComments() {
    this.commentsService.getComments(this.params!)
      .subscribe(data => {
        if (data as CommentsType) {
          for (let i = 0; i < data.comments.length; i++) {
            this.comments.push(data.comments[i]);
          }
          console.log(this.comments);
        }
        this.likeAndDislikeComments();
      });
  }
  addMoreComments() {
    if (this.params === null) {
      this.params = {
        offset: 3,
        article: this.article.id,
      };
    } else {
      this.params = {
        offset: this.params!.offset + 10,
        article: this.article.id,
      };
    }
    this.loadComments();
  }

  addAction(comment: CommentType, action: ActionEnum) {
    this.commentsService.applyAction(comment.id, action)
      .subscribe({
        next: (data) => {
          if (action === this.action.violet) {
            this._snackBar.open('Жалоба отправлена');

          } else {
            this._snackBar.open('Ваш голос учтен');
            if (action === this.action.dislike) {
              if (comment.like) {
                comment.likesCount--;
                comment.like = false;
              }
              if (comment.dislike) {
                comment.dislikesCount--;
                comment.dislike = false;
                return;
              }
              comment.dislikesCount++;
              comment.dislike = true;
            }
            if (action === this.action.like) {
              if (comment.dislike) {
                comment.dislikesCount--;
                comment.dislike = false;
              }
              if (comment.like) {
                comment.likesCount--;
                comment.like = false;
                return;
              }
              comment.likesCount++;
              comment.like = true;
            }
          }
        },
        error: (data) => {
          if (!this.isLogged) {
            this._snackBar.open('Вам необходимо авторизоваться!');
          } else if (action === this.action.violet && data.error) {
            this._snackBar.open('Жалоба уже отправлена');

          }
        }
      });
  }

  likeAndDislikeComments() {
    if (this.isLogged) {
      for (let i = 0; i < this.comments.length; i++) {
        this.commentsService.getActionForComment(this.comments[i].id)
          .subscribe((data: CommentActionType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const error = (data as DefaultResponseType).message;
              this._snackBar.open(error);
              throw new Error(error);
            }
            const result = data as CommentActionType[];
            const actionDislike = result.find(item => item.action === "dislike");
            const actionLike = result.find(item => item.action === "like");
            if (actionDislike) {
              this.comments[i].dislike = true;
              this.comments[i].like = false;
            }
            if (actionLike) {
              this.comments[i].like = true;
              this.comments[i].dislike = false
            }
          })
      }
    }
  }
}
