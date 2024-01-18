import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGame } from 'src/app/models/IGame';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  private gameDetails = new BehaviorSubject<IGame>({} as IGame);

  constructor() { }

  get gameDetails$() {
    return this.gameDetails.asObservable();
  }

  setGameDetails(details: IGame) {
    this.gameDetails.next(details);
  }

  genRandomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  convertArrayToString(array: string[]): string {
    return array.filter(str => str !== ' ').join('');
  }


}
