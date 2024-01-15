import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  constructor() { }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
