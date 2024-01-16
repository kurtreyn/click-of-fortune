import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { IPuzzle } from '../../models/puzzleInterface';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  private inputFormValuesSubject = new BehaviorSubject<{ letter: string, solvePuzzle: string }>({ letter: '', solvePuzzle: '' });

  constructor() { }

  get inputFormValues$() {
    return this.inputFormValuesSubject.asObservable();
  }

  setInputFormValues(values: { letter: string, solvePuzzle: string }) {
    this.inputFormValuesSubject.next(values);
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


}
