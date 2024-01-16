import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
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
  correctGuessedLetters: string[] = [];
  inputGuessMax: number = 0;
  inputGuessCount: number = 0;
  canGuess: boolean = true;
  inputSpinCount: number = 0;
  globalSpinCount: number = 0;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private puzzleService: PuzzleService) { }

  inputForm!: FormGroup;

  ngOnInit() {
    this.createForm();
    this.getCorrectAnswerKey();
    this.getCorrectGuessedLetters();
    this.setInputGuessMax();
    this.getSpinCount();
    console.log('INPUT this.inputAnswerKey: ', this.inputAnswerKey);
    console.log('INPUT this.correctGuessedLetters: ', this.correctGuessedLetters);
    console.log('INPUT this.inputGuessMax: ', this.inputGuessMax);
    console.log('INPUT this.inputGuessCount: ', this.inputGuessCount);
    console.log('INPUT this.inputSpinCount: ', this.inputSpinCount);
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
      console.log('CORRECT letters: ', letters);
    });
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
    if (this.correctGuessedLetters.length === this.inputAnswerKey.length) {
      for (let i = 0; i < this.correctGuessedLetters.length; i++) {
        let correctLetter = this.correctGuessedLetters[i];
        let answerKeyLetter = this.inputAnswerKey[i];
        console.log(`correctLetter: ${correctLetter}, answerKeyLetter: ${answerKeyLetter}`)
        if (correctLetter !== answerKeyLetter) {
          this.puzzleService.setIsWinner(false);
        } else {
          this.puzzleService.setIsWinner(true);
        }
      }
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
        console.log('MAX: ', this.inputGuessMax)
        console.log('After increment: ', this.inputGuessCount);
      }
      // console.log('this.inputGuessCount: ', this.inputGuessCount);
    } else {
      alert('You have no more guesses left!');
    }
    this.checkIfWinner();
    this.inputForm.reset();
  }

}
