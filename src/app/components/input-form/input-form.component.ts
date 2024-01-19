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
  newGame: boolean = false;

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
      // console.log('INPUT hasSpun: ', details.hasSpun)
      // console.log('INPUT canGuess: ', details.canGuess)
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
    if (this.availablePuzzles.length > 0) {
      this.updateAvailablePuzzles();
      const randomIndex = Math.floor(Math.random() * this.availablePuzzles.length);
      const randomPuzzle = this.availablePuzzles[randomIndex];
      const puzzleId: string = randomPuzzle.id as string;
      const emptyArr = this.puzzleService.createMaksedPuzzleArr(randomPuzzle.puzzle);
      const answerKey = this.puzzleService.convertStringToArray(randomPuzzle.puzzle);
      const answerString = this.puzzleService.convertArrayToString(answerKey);
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
        guessCount: this.guessCount,
        canGuess: false,
        hasSpun: false,
        spinActive: false,
        spinValue: 0,
        spinCount: 0,
        spinDisabled: false,
        maxGuess: answerKey.length,
        answerKey: answerKey,
        answerLength: answerKey.length,
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



  updateEmptyPuzzleLetterArray(letter: string) {
    if (this.gameDetails && this.gameDetails.answerKey && this.gameDetails.answerKey.length > 0) {
      let answArr = this.gameDetails.answerKey;
      let emptyArr = this.gameDetails.maskedPuzzleArr || [];

      for (let i = 0; i < answArr.length; i++) {
        if (answArr[i] === letter) {
          emptyArr[i] = letter;
        }
      }

      this.setGameDetails({
        ...this.gameDetails,
        maskedPuzzleArr: emptyArr,
      });
    }
  }


  checkGameStatus() {
    if (this.gameDetails && this.gameDetails.guessCount && this.gameDetails.maxGuess && this.gameDetails.answerKey && this.gameDetails.answerKey.length > 0 && this.gameDetails.maskedPuzzleArr && this.gameDetails.maskedPuzzleArr.length > 0) {
      if (this.gameDetails.guessCount === this.gameDetails.maxGuess) {
        let hasWon = false;
        let hasLost = false;
        let totalScore = this.gameDetails.score || 0;
        let answerKey = this.gameDetails.answerString
        let valueString = this.puzzleService.convertArrayToString(this.gameDetails.maskedPuzzleArr);
        let startNewGame = this.gameDetails.startNewGame || false;

        if (answerKey === valueString) {
          hasWon = true;
          hasLost = false;
          startNewGame = true;
          alert('You won!');
        } else if (answerKey !== valueString && this.gameDetails.guessCount === this.gameDetails.maxGuess) {
          hasWon = false;
          hasLost = true;
          startNewGame = true;
          alert('Sorry, you lost!');
        } else {
          hasWon = false;
          hasLost = true;
          startNewGame = true;
          alert('Sorry, you lost!');
        }

        if (startNewGame) {
          this.startNewGame();
        }

        this.setGameDetails({
          ...this.gameDetails,
          hasWon: hasWon,
          hasLost: hasLost,
          startNewGame: startNewGame,
          totalScore: totalScore,
        });
      }
    }
  }


  handleSubmit() {
    if (this.inputForm.valid && this.gameDetails.hasSpun && this.gameDetails.canGuess) {
      this.letter = this.inputForm.value.letter;

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
      let answArr = this.gameDetails.answerKey || [];
      const newEmptyArr = [...currentEmptyArr];
      let canGuess = false;
      let hasSpun = false;


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
      if (this.gameDetails.maxGuess) {
        if (this.guessCount >= this.gameDetails.maxGuess) {
          canGuess = false;
        }
      }

      this.setGameDetails({
        ...this.gameDetails,
        inputValues: { letter: this.letter },
        correctGuessedLetters: this.correctGuesses,
        allGuessedLetters: this.guessedLetters,
        guessCount: this.guessCount,
        canGuess: canGuess,
        hasSpun: hasSpun,
        maskedPuzzleArr: newEmptyArr,
      });
    } else {
      if (this.gameDetails.hasSpun === false) {
        alert('Spin the wheel first!');
      }
    }

    this.inputForm.reset();

    setTimeout(() => {
      this.checkGameStatus();
    }, 200);
  }
}
