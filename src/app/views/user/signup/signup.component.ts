import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  signUp() {
    if (this.signUpForm.valid && this.signUpForm.value.email &&
      this.signUpForm.value.password && this.signUpForm.value.name) {
      this.authService.signup(this.signUpForm.value.name, this.signUpForm.value.email, this.signUpForm.value.password)
        .subscribe({
          next: (data:DefaultResponseType | LoginResponseType) => {
            let error = null
            if((data as DefaultResponseType).error !== undefined){
              error = (data as DefaultResponseType).message
            }

            const loginResponse = data as LoginResponseType
            if(!loginResponse.accessToken ||
              !loginResponse.refreshToken ||
              !loginResponse.userId){
              error = 'Ошибка при регистрации'
            }
            if(error){
              this._snackBar.open(error)
              throw new Error(error)
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken)
            this.authService.userId = loginResponse.userId

            this._snackBar.open('Регистрация успешна')
            this.router.navigate(['/'])

          },

          error: (errorResponse: HttpErrorResponse) => {
            if(errorResponse.error && errorResponse.error.message){
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка при регистрации')
            }
          }
        })
    }
  }

}
