import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriesType } from 'src/types/categories.type';
import { TypeType } from 'src/types/type.type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories')
  }

}
