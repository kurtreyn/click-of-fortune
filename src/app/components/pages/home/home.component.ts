import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription, take, Subject, takeUntil } from 'rxjs';

import { ApiService } from '../../../services/api/api.service';
import { PuzzleService } from '../../../services/puzzle/puzzle.service';
import { IGame } from '../../../models/IGame';
import { IPuzzle } from 'src/app/models/IPuzzle';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, OnChanges {
  subscription!: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();
  allPuzzles: IPuzzle[] = [];
  availablePuzzles: IPuzzle[] = [];
  usedPuzzles: string[] = [];
  gameDetails: IGame = {} as IGame;
  currentPuzzle: IPuzzle = {} as IPuzzle;

  constructor(private apiService: ApiService, private puzzleService: PuzzleService) { }

  ngOnInit() {
    this.loadAllPuzzles();
  }

  ngOnChanges() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.next(true);
  }


  loadAllPuzzles() {
    this.apiService.getPuzzles().subscribe(puzzles => {
      if (puzzles && puzzles.length > 0) {
        this.allPuzzles = puzzles;
        this.setCurrentPuzzle();
        this.updateGameDetails();
      }
    });
  }

  setGameDetails(details: IGame) {
    this.gameDetails = details;
    this.puzzleService.setGameDetails(this.gameDetails);
  }

  setCurrentPuzzle() {
    if (this.allPuzzles.length > 0) {
      if (this.availablePuzzles.length === 0 && this.usedPuzzles.length === 0) {
        this.allPuzzles.forEach(puzzle => {
          this.availablePuzzles.push(puzzle);
        });
      } else {
        this.allPuzzles.forEach(puzzle => {
          if (!this.usedPuzzles.includes(puzzle.id as string)) {
            this.availablePuzzles.push(puzzle);
          }
        });
      }
      const randomIndex = Math.floor(Math.random() * this.availablePuzzles.length);
      const randomPuzzle = this.availablePuzzles[randomIndex];
      const puzzleId: string = randomPuzzle.id as string;

      this.currentPuzzle = randomPuzzle;
      this.usedPuzzles.push(puzzleId);

      console.log('allPuzzles: ', this.allPuzzles);
      console.log('availablePuzzles: ', this.availablePuzzles);
      console.log('randomPuzzle: ', randomPuzzle)
      console.log('puzzleId: ', puzzleId);
      console.log('usedPuzzles: ', this.usedPuzzles);
    }
  }

  updateGameDetails() {
    if (this.currentPuzzle) {
      let maxSpins = 0;
      let puzzVal = this.currentPuzzle.puzzle;
      let puzzValArr = puzzVal.split('');
      for (let i = 0; i < puzzValArr.length; i++) {
        if (puzzValArr[i] === ' ') {
          puzzValArr.splice(i, 1);
        }
      }
      maxSpins = puzzValArr.length;
      this.setGameDetails({
        ...this.gameDetails,
        maxSpins: maxSpins,
        answerKey: puzzValArr,
        answerLength: puzzValArr.length,
        guessMax: puzzValArr.length,
        answerString: this.puzzleService.convertArrayToString(puzzValArr),
        puzzleCategory: this.currentPuzzle.category,
        puzzleValue: this.currentPuzzle.puzzle,
        usedPuzzles: this.usedPuzzles
      });
    }
  }



}

