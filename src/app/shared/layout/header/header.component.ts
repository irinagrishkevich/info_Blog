import {Component, OnInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/default-response.type';
import { UserInfoType } from 'src/types/user-info.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userName: string = '';

  constructor(private authServices: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authServices.isLogged$.subscribe((isLoggedIn) => {
      this.isLogged = isLoggedIn;
      if (this.isLogged) {
        this.getUserName();
      } else {
        this.userName = '';
      }
    });
  }
  getUserName(): void {
    this.authServices.getUserInfo().subscribe(
      (data: DefaultResponseType | UserInfoType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          this._snackBar.open((data as DefaultResponseType).message, '', {
            duration: 3000,
          });
        } else {
          this.userName = (data as UserInfoType).name;
        }
      },
      (error) => {
        console.error('Error fetching user info:', error);
        this._snackBar.open('Ошибка при получении информации о пользователе', '', {
          duration: 3000,
        });
      }
    );
  }

  // Логика выхода из системы
  logout(): void {
    this.authServices.logout().subscribe({
      next:() => {
        this.authServices.removeTokens();
        this._snackBar.open('Вы успешно вышли из системы', '', {
          duration: 3000,
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
      console.error('Logout error:', error);
      this._snackBar.open('Ошибка при выходе из системы', '', {
        duration: 3000,
      });
    }
      }

    );
  }


}
