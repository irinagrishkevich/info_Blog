import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  })
  loginError: string | null = null;
  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) { }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  login(){
    if(this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password){
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null
            if((data as DefaultResponseType).error !== undefined){
              error = (data as DefaultResponseType).message
            }
            const loginResponse = data as LoginResponseType
            if(!loginResponse.accessToken ||
              !loginResponse.refreshToken ||
              !loginResponse.userId){
              error = 'Ошибка при авторизации'
            }
            if(error){
              this._snackBar.open(error)
              throw new Error(error)
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken)
            this.authService.userId = loginResponse.userId

            this._snackBar.open('Авторизация успешна')
            this.router.navigate(['/'])
          },
          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message){
              this.loginError = 'Неверный Email или пароль'
              setTimeout(() => {
                this.loginError = null
              }, 1500)
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка при авторизации')
            }
          }
        })
    }

  }

  get validEmail(): boolean | undefined {
    return this.loginForm.get('email')?.invalid
      && (this.loginForm.get('email')?.dirty || this.loginForm.get('email')?.touched)
  }

  get validPassword(): boolean | undefined {
    return this.loginForm.get('password')?.invalid
      && (this.loginForm.get('password')?.dirty || this.loginForm.get('password')?.touched)
  }

}
