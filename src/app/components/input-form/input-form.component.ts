import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { PuzzleService } from '../../services/puzzle/puzzle.service';
import { IGame } from '../../models/IGame';

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
  guessedLetters: string[] = [];
  correctGuesses: string[] = [];
  guessCount: number = 0;
  canGuess: boolean = true;

  constructor(private formBuilder: FormBuilder, private puzzleService: PuzzleService) {
  }

  inputForm!: FormGroup;

  ngOnInit() {
    this.createForm();
    this.loadGameDetails();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.next(true);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
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
  }

  setGameDetails(details: IGame) {
    this.gameDetails = details;
    this.puzzleService.setGameDetails(this.gameDetails);
  }



  updateEmptyPuzzleLetterArray(letter: string) {
    console.log('UPDATE EMPTY PUZZLE LETTER ARRAY letter: ', letter);
    if (this.gameDetails && this.gameDetails.answerKey && this.gameDetails.answerKey.length > 0) {
      let answArr = this.gameDetails.answerKey;
      let emptyArr = this.gameDetails.emptyPuzzleLetterArray || [];
      console.log('answArr: ', answArr);
      console.log('emptyArr: ', emptyArr);

      for (let i = 0; i < answArr.length; i++) {
        if (answArr[i] === letter) {
          emptyArr[i] = letter;
        }
      }

      this.setGameDetails({
        ...this.gameDetails,
        emptyPuzzleLetterArray: emptyArr,
      });
    }
    console.log('UPDATE EMPTY PUZZLE LETTERS gameDetails: ', this.gameDetails.emptyPuzzleLetterArray);
  }

  handleSubmit() {
    this.letter = this.inputForm.value.letter;
    this.guessCount++;
    if (this.letter !== '' || this.letter !== null) {
      this.guessedLetters.push(this.letter);
    }
    let correctLetter;
    let canGuess = true;
    let currentEmptyArr = this.gameDetails.emptyPuzzleLetterArray || [];
    let answArr = this.gameDetails.answerKey || [];
    const newEmptyArr = [...currentEmptyArr];

    if (this.gameDetails.answerKey) {
      for (let i = 0; i < answArr.length; i++) {
        if (answArr[i] === this.letter) {
          newEmptyArr[i] = this.letter;
        }
      }
    }
    if (this.gameDetails.answerKey?.includes(this.letter)) {
      correctLetter = this.letter;
      this.correctGuesses.push(correctLetter);
    }
    if (this.gameDetails.guessMax) {
      if (this.guessCount >= this.gameDetails.guessMax) {
        canGuess = false;
      }
    }


    this.setGameDetails({
      ...this.gameDetails,
      inputValues: { letter: this.letter },
      correctGuessedLetters: this.correctGuesses,
      allGuessedLetters: this.guessedLetters,
      guessCount: this.guessCount,
      canGuess: this.canGuess,
      emptyPuzzleLetterArray: newEmptyArr,
    });

    this.inputForm.reset();
  }
}
