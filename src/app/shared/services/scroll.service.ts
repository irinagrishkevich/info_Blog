import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private fragmentSource = new Subject<string>();
  fragment$ = this.fragmentSource.asObservable();

  setFragment(fragment: string) {
    this.fragmentSource.next(fragment);
  }
}
