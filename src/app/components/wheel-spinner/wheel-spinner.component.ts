import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PuzzleService } from '../../services/puzzle/puzzle.service';
import { SpinnerEnum } from '../../enums/spinner-enum';

@Component({
  selector: 'app-wheel-spinner',
  templateUrl: './wheel-spinner.component.html',
  styleUrls: ['./wheel-spinner.component.css']
})
export class WheelSpinnerComponent implements OnInit, OnDestroy {
  spinActive: boolean = false;
  spinnerEnum = SpinnerEnum;
  spinnerValue: number = SpinnerEnum.ONE;
  score: number = 0;
  letter: string = '';
  solvePuzzle: string = '';
  @Input() puzzleValue!: string;
  guessedLetters: string[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private puzzleService: PuzzleService) { }

  ngOnInit(): void {
    this.getInputValues();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public spinWheel() {
    this.spinActive = true;
    const spinVal = this.getSpinValue(1, 6);
    switch (spinVal) {
      case 1:
        this.setSpinnerValue(SpinnerEnum.ONE);
        break;
      case 2:
        this.setSpinnerValue(SpinnerEnum.TWO);
        break;
      case 3:
        this.setSpinnerValue(SpinnerEnum.THREE);
        break;
      case 4:
        this.setSpinnerValue(SpinnerEnum.FOUR);
        break;
      case 5:
        this.setSpinnerValue(SpinnerEnum.FIVE);
        break;
      case 6:
        this.setSpinnerValue(SpinnerEnum.BANKRUPT);
        break;
      default:
        this.setSpinnerValue(SpinnerEnum.ONE);
        break;
    }



    setTimeout(() => {
      this.spinActive = false;
      this.setScore();
      console.log('this.spinnerValue: ', this.spinnerValue);
      console.log('this.score: ', this.score);
    }, 2000);
  }

  public getSpinValue(min: number, max: number): number {
    return this.puzzleService.getRandomNumber(min, max);
  }

  public setSpinnerValue(value: number) {
    this.spinnerValue = value;
  }

  public setScore() {
    if (this.spinnerValue !== SpinnerEnum.BANKRUPT) {
      this.score += this.spinnerValue;
    } else {
      this.score = 0;
    }
  }

  getInputValues() {
    this.puzzleService.inputFormValues$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(values => {
      let letter = values.letter;
      let solvePuzzle = values.solvePuzzle;
      console.log('letter: ', letter);
      console.log('solvePuzzle: ', solvePuzzle);
      if (letter !== '') {
        this.guessedLetters.push(letter);
      }
      console.log('WHEEL this.guessedLetters: ', this.guessedLetters);
    });
  }

}
