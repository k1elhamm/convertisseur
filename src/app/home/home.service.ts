import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Conversion } from './conversion';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  historySource: BehaviorSubject<Array<Conversion>> = new BehaviorSubject([]);
  history = this.historySource.asObservable();

  constructor() { }

  addData(conversion) {
    const currentValue = this.historySource.value;
    console.log('currentValue', currentValue);
    const updatedValue = [...currentValue, conversion];
    this.historySource.next(updatedValue);
}

}
