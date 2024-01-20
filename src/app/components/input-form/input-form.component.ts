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
  availablePuzzles: IPuzzle[] = [];
  currentPuzzle: IPuzzle = {} as IPuzzle;
  usedPuzzles: string[] = [];
  guessCount: number = 0;
  remainingGuess: number = 0;
  newGame: boolean = false;
  totalScore: number = 0;

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
      letter: new FormControl('', [Validators.required]),
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
      const answerString = this.puzzleService.createNoSpaceStrFromArr(answerArr);
      const puzzVal = randomPuzzle.puzzle;
      const remainingGuess = answerArr.length;
      this.currentPuzzle = randomPuzzle;
      this.guessedLetters = [];
      this.correctGuesses = [];
      this.guessCount = 0;
      this.usedPuzzles.push(puzzleId);

      this.setGameDetails({
        ...this.gameDetails,
        hasWon: false,
        hasLost: false,
        startNewGame: false,
        currentPuzzle: this.currentPuzzle,
        availablePuzzles: this.availablePuzzles,
        usedPuzzles: this.usedPuzzles,
        maskedPuzzleArr: emptyArr,
        indexRefArr: this.puzzleService.convertStringToArray(puzzVal),
        guessCount: this.guessCount,
        remainingGuess: remainingGuess,
        correctGuessedString: '',
        canGuess: false,
        hasSpun: false,
        spinActive: false,
        spinValue: 0,
        spinCount: 0,
        spinDisabled: false,
        maxGuess: answerArr.length,
        answerArr: answerArr,
        answerLength: answerArr.length,
        answerString: answerString,
        puzzleCategory: this.currentPuzzle.category,
        puzzleValue: this.currentPuzzle.puzzle,
        correctGuessedLetters: this.correctGuesses,
        allGuessedLetters: this.guessedLetters,
        score: 0,
        inputValues: { letter: '' },
      });
    }
  }


  checkGameStatus() {
    if (this.gameDetails && this.gameDetails.guessCount && this.gameDetails.maxGuess && this.gameDetails.answerArr && this.gameDetails.answerArr.length > 0 && this.gameDetails.maskedPuzzleArr && this.gameDetails.maskedPuzzleArr.length > 0) {
      let hasWon = false;
      let hasLost = false;
      let answerKey = this.gameDetails.answerString
      let startNewGame = this.gameDetails.startNewGame || false;
      let correctGuessStrNoSpaces = this.puzzleService.createNoSpaceStrFromArr(this.gameDetails.maskedPuzzleArr);

      if (this.gameDetails.guessCount <= this.gameDetails.maxGuess && answerKey === correctGuessStrNoSpaces) {
        hasWon = true;
        hasLost = false;
        startNewGame = true;
        alert("You won!");
      }

      if (this.gameDetails.guessCount === this.gameDetails.maxGuess) {
        if (answerKey === correctGuessStrNoSpaces) {
          hasWon = true;
          hasLost = false;
          startNewGame = true;
          alert("You won!");
        } else if (answerKey !== correctGuessStrNoSpaces && this.gameDetails.guessCount === this.gameDetails.maxGuess) {
          hasWon = false;
          hasLost = true;
          startNewGame = true;
          alert("Sorry, you lost");
        } else {
          hasWon = false;
          hasLost = true;
          startNewGame = true;
          alert("Sorry, you lost");
        }
      }

      this.setGameDetails({
        ...this.gameDetails,
        hasWon: hasWon,
        hasLost: hasLost,
        startNewGame: startNewGame,
        totalScore: this.totalScore
      });

      console.log('hasWon: ', hasWon);

      if (startNewGame) {
        this.startNewGame();
      }
    }
  }


  handleSubmit() {
    if (this.inputForm.valid && this.gameDetails.hasSpun && this.gameDetails.canGuess, this.gameDetails.maxGuess) {
      this.letter = this.inputForm.value.letter.toLowerCase();

      if (this.letter !== '' || this.letter !== null) {
        if (this.guessedLetters.includes(this.letter)) {
          alert(`You've already guessed ${this.letter.toUpperCase()}`)
          this.inputForm.reset();
          return;
        } else {
          this.guessedLetters.push(this.letter);
          this.guessCount++;
        }
      }
      let correctLetter;
      let currentEmptyArr = this.gameDetails.maskedPuzzleArr || [];
      const newEmptyArr = [...currentEmptyArr];
      let indexRefArr = this.gameDetails.indexRefArr || [];
      let canGuess = false;
      let hasSpun = false;
      let correctGuessedString;


      if (this.gameDetails.indexRefArr) {
        for (let i = 0; i < indexRefArr.length; i++) {
          if (indexRefArr[i] === this.letter) {
            newEmptyArr[i] = this.letter;
            correctGuessedString = this.puzzleService.convertArrayToString(newEmptyArr);
          }
        }
      }
      if (this.gameDetails.answerArr?.includes(this.letter)) {
        correctLetter = this.letter;
        this.correctGuesses.push(correctLetter);
        if (this.gameDetails.score) {
          this.totalScore += this.gameDetails.score;
        }
      }
      if (this.gameDetails.maxGuess) {
        if (this.guessCount >= this.gameDetails.maxGuess) {
          canGuess = false;
        }
      }
      this.remainingGuess = this.gameDetails.maxGuess - this.guessCount;

      this.setGameDetails({
        ...this.gameDetails,
        inputValues: { letter: this.letter },
        correctGuessedLetters: this.correctGuesses,
        allGuessedLetters: this.guessedLetters,
        guessCount: this.guessCount,
        remainingGuess: this.remainingGuess,
        canGuess: canGuess,
        hasSpun: hasSpun,
        maskedPuzzleArr: newEmptyArr,
        correctGuessedString: correctGuessedString,
      });
    } else {
      if (this.gameDetails.hasSpun === false || this.gameDetails.hasSpun === undefined) {
        alert('Spin the wheel first!');
      }
    }

    this.inputForm.reset();

    setTimeout(() => {
      this.checkGameStatus();
    }, 400);
  }
}
