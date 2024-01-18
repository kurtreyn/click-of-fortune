import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PuzzleService } from '../../services/puzzle/puzzle.service';
import { SpinnerEnum } from '../../enums/spinner-enum';
import { IGame } from '../../models/IGame';

@Component({
  selector: 'app-wheel-spinner',
  templateUrl: './wheel-spinner.component.html',
  styleUrls: ['./wheel-spinner.component.css']
})
export class WheelSpinnerComponent implements OnInit, OnDestroy {
  subscription!: Subject<boolean>;
  puzzleDetails: IGame = {} as IGame;
  spinnerEnum = SpinnerEnum;
  spinnerValue: number = SpinnerEnum.ONE;
  letter: string = '';
  destroy$: Subject<boolean> = new Subject<boolean>();
  // score: number = 0;
  // guessedLetters: string[] = [];
  // wheelMaxSpinCount: number = 5;
  // wheelSpinCount: number = 0;
  // globalSpinCount: number = 0;
  // wheelSpinnerDisabled: boolean = false;

  constructor(private puzzleService: PuzzleService) { }

  ngOnInit(): void {
    // this.getInputValues();
    // this.getMaxSpinCount();
    // this.getSpinCount();
    // console.log("WHEEL globalSpinCount: ", this.globalSpinCount);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public spinWheel() {
    // if (!this.wheelSpinnerDisabled) {
    //   this.spinActive = true;
    //   const spinVal = this.getSpinValue(1, 6);
    //   switch (spinVal) {
    //     case 1:
    //       this.setSpinnerValue(SpinnerEnum.ONE);
    //       break;
    //     case 2:
    //       this.setSpinnerValue(SpinnerEnum.TWO);
    //       break;
    //     case 3:
    //       this.setSpinnerValue(SpinnerEnum.THREE);
    //       break;
    //     case 4:
    //       this.setSpinnerValue(SpinnerEnum.FOUR);
    //       break;
    //     case 5:
    //       this.setSpinnerValue(SpinnerEnum.FIVE);
    //       break;
    //     case 6:
    //       this.setSpinnerValue(SpinnerEnum.BANKRUPT);
    //       break;
    //     default:
    //       break;
    //   }
    //   this.wheelSpinCount++;
    //   this.setSpinCount(this.wheelSpinCount);
    //   setTimeout(() => {
    //     this.spinActive = false;
    //     this.setScore();
    //   }, 2000);
    // } else {
    //   alert('You have no more spins left!');
    // }
  }

  // getSpinValue(min: number, max: number): number {
  //   return this.puzzleService.genRandomNum(min, max);
  // }

  // getSpinCount() {
  //   this.puzzleService.spinCount$.pipe(
  //     takeUntil(this.destroy$)
  //   ).subscribe(count => {
  //     this.globalSpinCount = count;
  //   });
  // }

  // setSpinnerValue(value: number) {
  //   this.spinnerValue = value;
  // }

  // setScore() {
  //   if (this.spinnerValue !== SpinnerEnum.BANKRUPT) {
  //     this.score += this.spinnerValue;
  //   } else {
  //     this.score = 0;
  //   }
  //   this.puzzleService.setScore(this.score);
  // }

  // setSpinCount(count: number) {
  //   this.puzzleService.setSpinCount(count);
  // }

  // getInputValues() {
  //   this.puzzleService.inputFormValues$.pipe(
  //     takeUntil(this.destroy$)
  //   ).subscribe(values => {
  //     let letter = values.letter;
  //     let solvePuzzle = values.solvePuzzle;
  //     if (letter !== '') {
  //       this.guessedLetters.push(letter);
  //     }
  //   });
  // }

  // getMaxSpinCount() {
  //   this.puzzleService.maxSpinCount$.pipe(
  //     takeUntil(this.destroy$)
  //   ).subscribe(max => {
  //     this.wheelMaxSpinCount = max;
  //   });
  // }

  // disableSpinner() {
  //   if (this.wheelSpinCount >= this.wheelMaxSpinCount) {
  //     this.wheelSpinnerDisabled = true;
  //     this.puzzleService.setSpinDisabled(true);
  //   }
  // }

  // checkSpinDisabled() {
  //   this.puzzleService.spinDisabled$.pipe(
  //     takeUntil(this.destroy$)
  //   ).subscribe(disabled => {
  //     this.wheelSpinnerDisabled = disabled;
  //   });
  // }



}
