import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {environment} from 'src/environments/environment';
import { UserInfoType } from 'src/types/user-info.type';
import {DefaultResponseType} from '../../types/default-response.type';
import {LoginResponseType} from '../../types/login-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey = 'accessToken'
  public refreshTokenKey = 'refreshToken'
  public userIdKey = 'userId'

  private isLoggedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!localStorage.getItem(this.accessTokenKey));
  public isLogged$ = this.isLoggedSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe
    });
  }

  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {name, email, password});
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens()
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {refreshToken: tokens.refreshToken})
    }

    throw throwError(()=> 'Can not find token')
  }

  getUserInfo(): Observable<DefaultResponseType | UserInfoType> {
    return this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'users')
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens()
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {refreshToken: tokens.refreshToken})
    }

    throw throwError(()=> 'Can not find token')
  }

  getIsLoggedIn() {
    return this.isLoggedSubject.value
  }

  setTokens(accessToken: string, refreshToken: string){
    localStorage.setItem(this.accessTokenKey, accessToken)
    localStorage.setItem(this.refreshTokenKey, refreshToken)
    this.isLoggedSubject.next(true);
  }

  removeTokens(){
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    this.isLoggedSubject.next(false);
  }

  getTokens(): {accessToken: string | null, refreshToken: string | null}{
    return{
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }
  get userId(): string | null{
    return localStorage.getItem(this.userIdKey)
  }
  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id)
    } else {
      localStorage.removeItem(this.userIdKey)
    }

  }

}
