import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { PuzzleService } from '../../services/puzzle/puzzle.service';
import { IGame } from '../../models/IGame';
import { IPuzzle } from '../../models/IPuzzle'

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();
  gameDetails: IGame = {} as IGame;
  letter: string = '';

  constructor(private formBuilder: FormBuilder, private puzzleService: PuzzleService) {
  }

  inputForm!: FormGroup;

  ngOnInit() {
    this.createForm();
    this.loadGameDetails();
    // this.getCorrectAnswerKey();
    // this.getCorrectGuessedLetters();
    // this.setInputGuessMax();
    // this.getSpinCount();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.next(true);
  }

  createForm() {
    this.inputForm = this.formBuilder.group({
      letter: new FormControl('', [Validators.required]),
    });
  }

  loadGameDetails() {
    this.puzzleService.gameDetails$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(details => {
      this.gameDetails = details;
    });
    // console.log('gameDetails: ', this.gameDetails)
    // this.createPuzzleLetterArray();
  }

  setGameDetails(details: IGame) {
    this.gameDetails = details;
    this.puzzleService.setGameDetails(this.gameDetails);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }


  // getCorrectGuessedLetters() {
  //   this.puzzleService.correctGuessedLetters$.pipe(
  //     takeUntil(this.destroy$)
  //   ).subscribe(letters => {
  //     this.correctGuessedLetters = letters;
  //     this.correctGuessedString = this.convertArrayToString(this.correctGuessedLetters);
  //   });
  // }




  // setInputGuessMax() {
  //   this.puzzleService.maxSpinCount$.subscribe(max => {
  //     this.inputGuessMax = max;
  //   });
  // }

  // getSpinCount() {
  //   this.puzzleService.spinCount$.pipe(
  //     takeUntil(this.destroy$)
  //   ).subscribe(count => {
  //     console.log('INPUT getSpinCount: ', count)
  //     this.globalSpinCount = count;
  //     console.log('INPUT globalSpinCount: ', this.globalSpinCount);
  //   });
  // }

  // checkIfCanGuess() {
  //   if (this.inputGuessCount >= this.inputGuessMax) {
  //     this.canGuess = false;
  //   }
  //   if (this.globalSpinCount === this.inputSpinCount) {
  //     this.canGuess = false;
  //     alert('Spin the wheel before making a guess')
  //     // this.inputForm.reset();
  //   }
  // }

  // checkIfWinner() {
  //   if (this.correctGuessedString === this.inputAnswerString) {
  //     this.puzzleService.setIsWinner(true);
  //     alert('You won!');
  //   }
  // }

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
    this.letter = this.inputForm.value.letter;
    this.setGameDetails({
      ...this.gameDetails,
      inputValues: { letter: this.letter }
    });
    // console.log('UPDATED gameDetails: ', this.gameDetails)
    // this.solvePuzzle = this.inputForm.value.solvePuzzle;
    // if (this.canGuess) {
    //   this.puzzleService.setInputFormValues({ letter: this.letter, solvePuzzle: this.solvePuzzle });
    //   if (this.inputAnswerKey.includes(this.letter)) {
    //     this.puzzleService.setCorrectGuessedLetters([...this.correctGuessedLetters, this.letter]);
    //   }
    //   if (this.inputGuessCount < this.inputGuessMax) {
    //     this.inputGuessCount++;
    //   }
    // } else {
    //   alert('You have no more guesses left!');
    // }
    // this.checkIfWinner();

    this.inputForm.reset();
  }

}
