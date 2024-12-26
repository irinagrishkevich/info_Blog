import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { LoginResponseType } from 'src/types/login-response.type';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  passwordVisible: boolean = false;

  signUpForm = this.fb.group({
    name: ['', [Validators.required,Validators.pattern(/^(?:[А-ЯЁ][а-яё]+(?: [А-ЯЁ][а-яё]+)*)?$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  })
  currentFragment: string = '';


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private scrollService: ScrollService) { }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe((fragment) => {
      this.currentFragment = fragment || '';
    });
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  signUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.signUpForm.value;
    if (name && email && password) {
      this.authService.signup(name, email, password)
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

  get validName(): boolean | undefined {
    return this.signUpForm.get('name')?.invalid
      && (this.signUpForm.get('name')?.dirty || this.signUpForm.get('name')?.touched)
  }
  get validAgree(): boolean | undefined {
    return this.signUpForm.get('agree')?.invalid
      && (this.signUpForm.get('agree')?.dirty || this.signUpForm.get('agree')?.touched)
  }

  get validEmail(): boolean | undefined {
    return this.signUpForm.get('email')?.invalid
      && (this.signUpForm.get('email')?.dirty || this.signUpForm.get('email')?.touched)
  }

  get validPassword(): boolean | undefined {
    return this.signUpForm.get('password')?.invalid
      && (this.signUpForm.get('password')?.dirty || this.signUpForm.get('password')?.touched)
  }


  navigateTo(fragment: string){
    this.scrollService.setFragment(fragment);
    this.router.navigate(['/policy'])

  }

}
