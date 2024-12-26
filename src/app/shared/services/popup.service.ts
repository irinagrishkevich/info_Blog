import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog,
              private http: HttpClient) { }

  setRequest(body: any): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', body);
  }

}
