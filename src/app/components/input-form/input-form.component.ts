import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { PuzzleService } from '../../services/puzzle/puzzle.service';
import { IPuzzle } from '../../models/puzzleInterface'

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit, OnDestroy {
  letter: string = '';
  solvePuzzle: string = '';
  newPuzzle: IPuzzle[] = [];
  subscription!: Subscription;
  inputAnswerKey: string[] = [];
  inputAnswerString: string = '';
  correctGuessedLetters: string[] = [];
  correctGuessedString: string = '';
  inputGuessMax: number = 0;
  inputGuessCount: number = 0;
  canGuess: boolean = true;
  inputSpinCount: number = 0;
  globalSpinCount: number = 0;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder, private puzzleService: PuzzleService) {
  }

  inputForm!: FormGroup;

  ngOnInit() {
    this.createForm();
    this.getCorrectAnswerKey();
    this.getCorrectGuessedLetters();
    this.setInputGuessMax();
    this.getSpinCount();
    this.inputAnswerString = this.convertArrayToString(this.inputAnswerKey);
    // this.correctGuessedString = this.convertArrayToString(this.correctGuessedLetters);
    console.log('INPUT this.inputAnswerKey: ', this.inputAnswerKey);
    console.log('INPUT this.correctGuessedLetters: ', this.correctGuessedLetters);
    // console.log('INPUT this.inputGuessMax: ', this.inputGuessMax);
    // console.log('INPUT this.inputGuessCount: ', this.inputGuessCount);
    // console.log('INPUT this.inputSpinCount: ', this.inputSpinCount);
    console.log('INPUT this.answerString: ', this.inputAnswerString);
    console.log('INPUT this.correctGuessedString: ', this.correctGuessedString);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.next(true);
  }

  createForm() {
    this.inputForm = this.formBuilder.group({
      letter: new FormControl('', [Validators.required]),
      solvePuzzle: new FormControl('')
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  getCorrectAnswerKey() {
    this.puzzleService.answerKey$.subscribe(key => {
      this.inputAnswerKey = key;
    });
  }

  getCorrectGuessedLetters() {
    this.puzzleService.correctGuessedLetters$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(letters => {
      this.correctGuessedLetters = letters;
      // console.log('CORRECT letters: ', letters);
      this.correctGuessedString = this.convertArrayToString(this.correctGuessedLetters);
      // console.log('CORRECT this.correctGuessedString: ', this.correctGuessedString);
    });
  }


  convertArrayToString(array: string[]): string {
    return array.join('');
  }

  setInputGuessMax() {
    this.puzzleService.maxSpinCount$.subscribe(max => {
      this.inputGuessMax = max;
    });
  }

  getSpinCount() {
    this.puzzleService.spinCount$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(count => {
      console.log('INPUT getSpinCount: ', count)
      this.globalSpinCount = count;
      console.log('INPUT globalSpinCount: ', this.globalSpinCount);
    });
  }

  checkIfCanGuess() {
    if (this.inputGuessCount >= this.inputGuessMax) {
      this.canGuess = false;
    }
    if (this.globalSpinCount === this.inputSpinCount) {
      this.canGuess = false;
      alert('Spin the wheel before making a guess')
      // this.inputForm.reset();
    }
  }

  checkIfWinner() {
    if (this.correctGuessedString === this.inputAnswerString) {
      this.puzzleService.setIsWinner(true);
      alert('You won!');
    }
  }

  // getIsWinner() {
  //   this.puzzleService.isWinner$.pipe(
  //     takeUntil(this.destroy$)
  //   ).subscribe(isWinner => {
  //     if (isWinner) {
  //       alert('You won!');
  //       this.inputForm.reset();
  //     }
  //   });
  // }

  handleSubmit() {
    // this.checkIfCanGuess();
    this.letter = this.inputForm.value.letter;
    this.solvePuzzle = this.inputForm.value.solvePuzzle;
    if (this.canGuess) {
      this.puzzleService.setInputFormValues({ letter: this.letter, solvePuzzle: this.solvePuzzle });
      if (this.inputAnswerKey.includes(this.letter)) {
        this.puzzleService.setCorrectGuessedLetters([...this.correctGuessedLetters, this.letter]);
      }
      // console.log('Before increment: ', this.inputGuessCount);
      if (this.inputGuessCount < this.inputGuessMax) {
        this.inputGuessCount++;
        // console.log('MAX: ', this.inputGuessMax)
        // console.log('After increment: ', this.inputGuessCount);
      }
      // console.log('this.inputGuessCount: ', this.inputGuessCount);
    } else {
      alert('You have no more guesses left!');
    }
    this.checkIfWinner();

    this.inputForm.reset();
  }

}
