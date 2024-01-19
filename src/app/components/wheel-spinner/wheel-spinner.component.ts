import { Component, OnInit, OnDestroy } from '@angular/core';
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
  destroy$: Subject<boolean> = new Subject<boolean>();
  gameDetails: IGame = {} as IGame;
  spinnerEnum = SpinnerEnum;
  spinValue: number = SpinnerEnum.ONE;
  score: number = 0;
  spinCount: number = 0;
  spinActive: boolean = false;
  hasSpun: boolean = false;
  canGuess: boolean = false;

  constructor(private puzzleService: PuzzleService) { }

  ngOnInit(): void {
    this.loadGameDetails();

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  loadGameDetails() {
    this.puzzleService.gameDetails$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(details => {
      this.gameDetails = details;
    });
    // console.log('gameDetails: ', this.gameDetails)
  }

  setGameDetails(details: IGame) {
    this.gameDetails = details;
    this.puzzleService.setGameDetails(this.gameDetails);
  }

  spinWheel() {
    if (this.gameDetails) {
      if (!this.gameDetails.spinDisabled && !this.gameDetails.hasSpun) {
        this.gameDetails.spinActive = true;
        const spinVal = this.puzzleService.genRandomNum(1, 6);
        switch (spinVal) {
          case 1:
            this.setSpinValue(SpinnerEnum.ONE);
            break;
          case 2:
            this.setSpinValue(SpinnerEnum.TWO);
            break;
          case 3:
            this.setSpinValue(SpinnerEnum.THREE);
            break;
          case 4:
            this.setSpinValue(SpinnerEnum.FOUR);
            break;
          case 5:
            this.setSpinValue(SpinnerEnum.FIVE);
            break;
          case 6:
            this.setSpinValue(SpinnerEnum.BANKRUPT);
            break;
          default:
            break;
        }
        this.spinCount++;
        this.hasSpun = true;
        this.canGuess = true;
        setTimeout(() => {
          this.spinActive = false;
          this.setScore();
          this.updateGameDetails();
        }, 400);
      } else {
        this.hasSpun ? alert('Guess a letter before spinning again') : alert('No more spins available');
      }
    }
  }


  setScore() {
    if (this.spinValue !== SpinnerEnum.BANKRUPT) {
      this.score += this.spinValue;
    } else {
      this.score = 0;
    }
  }

  setSpinValue(value: number) {
    this.spinValue = value;
  }

  updateGameDetails() {
    if (this.gameDetails && this.gameDetails.maxSpins) {
      this.setGameDetails({
        ...this.gameDetails,
        spinCount: this.spinCount,
        spinValue: this.spinValue,
        score: this.score,
        spinActive: this.spinActive,
        hasSpun: this.hasSpun,
        spinDisabled: this.spinCount >= this.gameDetails.maxSpins ? true : false,
        canGuess: this.canGuess
      });
    }
  }









}
