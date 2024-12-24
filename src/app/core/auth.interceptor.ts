import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import { DefaultResponseType } from "src/types/default-response.type";
import { LoginResponseType } from "src/types/login-response.type";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor  implements HttpInterceptor{

  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.loaderService.show()

    const tokens = this.authService.getTokens()
    if(tokens && tokens.accessToken){
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken)
      })
      return next.handle(authReq)
        .pipe(
          catchError((error) => {
            if(error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')){
              return this.handle401Error(authReq, next)
            }
            return throwError(() => error)
          }),
          // finalize(() => {
          //   this.loaderService.hide()
          // })
        )
    }

    return next.handle(req)
    // .pipe(
    //   finalize(() => {
    //     this.loaderService.hide()
    //   })
    // )
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler){
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | LoginResponseType) => {
          let error = ''
          if((result as DefaultResponseType).error !== undefined){
            error = (result as DefaultResponseType).message
          }

          const refreshResult = result as LoginResponseType
          if(!refreshResult.accessToken ||
            !refreshResult.refreshToken ||
            !refreshResult.userId){
            error = 'Ошибка при авторизации'
          }

          if(error){
            return throwError(() => new Error(error))
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken)

          const authReq = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken)
          })
          return next.handle(authReq)

        }),
        catchError((error) => {
          this.authService.removeTokens()
          this.router.navigate(['/'])
          return throwError(() => error)
        })
      )
  }

}

