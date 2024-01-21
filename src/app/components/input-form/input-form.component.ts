import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { PuzzleService } from '../../services/puzzle/puzzle.service';
import { IGame } from '../../models/IGame';
import { IPuzzle } from '../../models/IPuzzle';

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
  incorrectGuesses: string[] = [];
  availablePuzzles: IPuzzle[] = [];
  currentPuzzle: IPuzzle = {} as IPuzzle;
  usedPuzzles: string[] = [];
  guessCount: number = 0;
  remainingGuess: number = 0;
  newGame: boolean = false;
  totalScore: number = 0;
  hasSpun: boolean = false;

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

  createForm() {
    this.inputForm = this.formBuilder.group({
      letter: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(1)]),
    });
  }

  loadGameDetails() {
    this.puzzleService.gameDetails$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(details => {
      this.gameDetails = details;
      this.availablePuzzles = details.availablePuzzles || [];
      this.usedPuzzles = details.usedPuzzles || [];
      this.newGame = details.startNewGame || false;
      this.remainingGuess = details.remainingGuess || 0;
      this.hasSpun = details.hasSpun || false;
      this.incorrectGuesses = details.incorrectGuessedLetters || [];
    });
  }

  setGameDetails(details: IGame) {
    this.gameDetails = details;
    this.puzzleService.setGameDetails(this.gameDetails);
  }

  updateAvailablePuzzles() {
    if (this.gameDetails && this.gameDetails.allPuzzles) {
      const filteredPuzzles = this.gameDetails.allPuzzles.filter(puzzle => !this.usedPuzzles.includes(puzzle.id as string));
      this.availablePuzzles = filteredPuzzles;
    }
  }

  startNewGame() {
    console.log('STARTING NEW GAME');
    if (this.availablePuzzles.length > 0) {
      this.updateAvailablePuzzles();
      const randomIndex = Math.floor(Math.random() * this.availablePuzzles.length);
      const randomPuzzle = this.availablePuzzles[randomIndex];
      const puzzleId: string = randomPuzzle.id as string;
      const emptyArr = this.puzzleService.createMaksedPuzzleArr(randomPuzzle.puzzle);
      const answerArr = this.puzzleService.createNoSpaceArrFromString(randomPuzzle.puzzle);
      const puzzVal = randomPuzzle.puzzle;
      const remainingGuess = answerArr.length;
      this.currentPuzzle = randomPuzzle;
      this.guessedLetters = [];
      this.correctGuesses = [];
      this.guessCount = 0;
      this.usedPuzzles.push(puzzleId);

      this.setGameDetails({
        ...this.gameDetails,
        allGuessedLetters: this.guessedLetters,
        answerArr: answerArr,
        answerLength: answerArr.length,
        answerString: this.puzzleService.createNoSpaceStrFromArr(answerArr),
        availablePuzzles: this.availablePuzzles,
        correctGuessedLetters: this.correctGuesses,
        correctGuessedString: '',
        currentPuzzle: this.currentPuzzle,
        guessCount: this.guessCount,
        hasSpun: false,
        hasWon: false,
        incorrectGuessedLetters: [],
        indexRefArr: this.puzzleService.convertStringToArray(puzzVal),
        inputValues: { letter: '' },
        maskedPuzzleArr: emptyArr,
        maxGuess: answerArr.length,
        puzzleCategory: this.currentPuzzle.category,
        puzzleValue: this.currentPuzzle.puzzle,
        remainingGuess: remainingGuess,
        score: 0,
        spinActive: false,
        spinDisabled: false,
        spinValue: 0,
        startNewGame: false,
        usedPuzzles: this.usedPuzzles,
      });
    }
  }


  checkGameStatus() {
    if (this.gameDetails && this.gameDetails.guessCount && this.gameDetails.maxGuess && this.gameDetails.answerArr && this.gameDetails.answerArr.length > 0 && this.gameDetails.maskedPuzzleArr && this.gameDetails.maskedPuzzleArr.length > 0) {
      let hasWon = false;
      let answerKey = this.gameDetails.answerString
      let startNewGame = this.gameDetails.startNewGame || false;
      let correctGuessStrNoSpaces = this.puzzleService.createNoSpaceStrFromArr(this.gameDetails.maskedPuzzleArr);

      if (this.gameDetails.guessCount <= this.gameDetails.maxGuess && answerKey === correctGuessStrNoSpaces) {
        hasWon = true;
        startNewGame = true;
        alert("You won!");
      }

      if (this.gameDetails.guessCount === this.gameDetails.maxGuess) {
        if (answerKey === correctGuessStrNoSpaces) {
          hasWon = true;
          startNewGame = true;
          alert("You won!");
        } else if (answerKey !== correctGuessStrNoSpaces && this.gameDetails.guessCount === this.gameDetails.maxGuess) {
          hasWon = false;
          startNewGame = true;
          alert("Sorry, you lost");
        } else {
          hasWon = false;
          startNewGame = true;
          alert("Sorry, you lost");
        }
      }

      this.setGameDetails({
        ...this.gameDetails,
        hasWon: hasWon,
        startNewGame: startNewGame,
        totalScore: this.totalScore
      });

      if (startNewGame) {
        this.startNewGame();
      }
    }
  }


  handleSubmit() {
    if (!this.hasSpun) {
      alert('Spin the wheel before guessing!');
      this.inputForm.reset();
      return;
    }

    if (this.inputForm.valid && this.hasSpun && this.gameDetails.maxGuess) {
      this.letter = this.inputForm.value.letter.toLowerCase();

      if (this.letter !== '' || this.letter !== null) {
        if (this.guessedLetters.includes(this.letter)) {
          alert(`You've already guessed ${this.letter.toUpperCase()}`)
          this.inputForm.reset();
          return;
        }
      }

      let currentMaskedArr = this.gameDetails.maskedPuzzleArr || [];
      const newMaskedArr = [...currentMaskedArr];
      let indexRefArr = this.gameDetails.indexRefArr || [];
      let correctGuessedString;

      if (this.gameDetails.indexRefArr) {
        for (let i = 0; i < indexRefArr.length; i++) {
          if (indexRefArr[i] === this.letter) {
            newMaskedArr[i] = this.letter;
            correctGuessedString = this.puzzleService.convertArrayToString(newMaskedArr);
          }
        }
      }

      if (this.gameDetails.answerArr?.includes(this.letter)) {
        this.correctGuesses.push(this.letter);
        this.guessedLetters.push(this.letter);
        if (this.gameDetails.score) {
          this.totalScore += this.gameDetails.score;
        }
      } else {
        this.incorrectGuesses.push(this.letter);
        this.guessedLetters.push(this.letter);
        this.guessCount++;
      }


      this.remainingGuess = this.gameDetails.maxGuess - this.guessCount;

      this.setGameDetails({
        ...this.gameDetails,
        allGuessedLetters: this.guessedLetters,
        correctGuessedLetters: this.correctGuesses,
        correctGuessedString: correctGuessedString,
        guessCount: this.guessCount,
        hasSpun: false,
        incorrectGuessedLetters: this.incorrectGuesses,
        inputValues: { letter: this.letter },
        maskedPuzzleArr: newMaskedArr,
        remainingGuess: this.remainingGuess,
      });
    }

    this.inputForm.reset();

    setTimeout(() => {
      this.checkGameStatus();
    }, 400);
  }
}
