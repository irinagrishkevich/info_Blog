import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  show$: Subject<boolean> = new Subject()

  constructor() {
  }

  show() {
    this.show$.next(true);
  }

  hide() {
    this.show$.next(false);

  }
}
