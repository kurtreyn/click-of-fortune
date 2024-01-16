import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription, take, Subject, takeUntil } from 'rxjs';

import { ApiService } from '../../../services/api/api.service';
import { PuzzleService } from '../../../services/puzzle/puzzle.service';
import { IPuzzle } from '../../../models/puzzleInterface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, OnChanges {
  allPuzzles: IPuzzle[] = [];
  allPuzzlesLength: number = 0;
  activePuzzle = new Subject<IPuzzle>();
  availablePuzzles: IPuzzle[] = [];
  usedPuzzles: IPuzzle[] = [];
  solvedPuzzles: IPuzzle[] = [];
  puzzleId: string = '';
  guessCount: number = 0;
  subscription!: Subscription;
  puzzleCategory: string = 'Category';
  puzzleValue: string = 'Test Puzzle Value'
  guessedLetters: string[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService, private puzzleService: PuzzleService) { }

  ngOnInit() {
    this.fetchAllPuzzles();
    this.getInputValues();
  }

  ngOnChanges() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.next(true);
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
      console.log('this.guessedLetters: ', this.guessedLetters);
    });
  }

  fetchAllPuzzles() {
    this.subscription = this.apiService.getPuzzles().subscribe(puzzle => {
      this.allPuzzles = puzzle;
      this.allPuzzlesLength = this.allPuzzles.length;
      this.setActivePuzzle();
    });
  }

  setActivePuzzle() {
    const randomIndex = Math.floor(Math.random() * this.allPuzzles.length);
    const randomPuzzle = this.allPuzzles[randomIndex];
    const alreadyUsed = this.usedPuzzles.find(puzzle => puzzle.id === randomPuzzle.id);
    // console.log('this.allPuzzles', this.allPuzzles)
    // console.log('randomIndex', randomIndex);
    console.log('randomPuzzle', randomPuzzle);
    // console.log('alreadyUsed', alreadyUsed);
    if (!alreadyUsed) {
      this.puzzleCategory = randomPuzzle.category;
      this.puzzleValue = randomPuzzle.puzzle;
      this.usedPuzzles.push(randomPuzzle);
    }
  }





  setPuzzleCategory(category: string) {
    this.puzzleCategory = category;
  }

  setPuzzleValue(puzzle: string) {
    this.puzzleValue = puzzle;
  }

  setGuessedLetters(letter: string) {
    this.guessedLetters.push(letter);
  }

  onInputFormValues(values: { letter: string, solvePuzzle: boolean }) {
    console.log(values.letter, values.solvePuzzle);
  }

}
