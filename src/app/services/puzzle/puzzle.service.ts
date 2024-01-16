import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  private inputFormValuesSubject = new BehaviorSubject<{ letter: string, solvePuzzle: string }>({ letter: '', solvePuzzle: '' });
  private maxSpinCount = new BehaviorSubject<number>(5);
  private spinCount = new BehaviorSubject<number>(0);
  private scoreSubject = new BehaviorSubject<number>(0);
  private answerKeySubject = new BehaviorSubject<string[]>([]);
  private correctGuessedLetters = new BehaviorSubject<string[]>([]);
  private spinDisabled = new BehaviorSubject<boolean>(false);
  private isWinner = new BehaviorSubject<boolean>(false);

  constructor() { }

  get inputFormValues$() {
    return this.inputFormValuesSubject.asObservable();
  }

  get maxSpinCount$() {
    return this.maxSpinCount.asObservable();
  }

  get spinCount$() {
    return this.spinCount.asObservable();
  }


  get score$() {
    return this.scoreSubject.asObservable();
  }

  get answerKey$() {
    return this.answerKeySubject.asObservable();
  }

  get correctGuessedLetters$() {
    return this.correctGuessedLetters.asObservable();
  }

  get isWinner$() {
    return this.isWinner.asObservable();
  }

  get spinDisabled$() {
    return this.spinDisabled.asObservable();
  }

  setInputFormValues(values: { letter: string, solvePuzzle: string }) {
    this.inputFormValuesSubject.next(values);
  }

  setMaxSpinCount(count: number) {
    this.maxSpinCount.next(count);
  }

  setSpinCount(count: number) {
    this.spinCount.next(count);
  }

  setScore(score: number) {
    this.scoreSubject.next(score);
  }

  setAnswerKey(key: string[]) {
    this.answerKeySubject.next(key);
  }

  setCorrectGuessedLetters(letters: string[]) {
    this.correctGuessedLetters.next(letters);
  }

  setIsWinner(isWinner: boolean) {
    this.isWinner.next(isWinner);
  }

  setSpinDisabled(spinDisabled: boolean) {
    this.spinDisabled.next(spinDisabled);
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


}
