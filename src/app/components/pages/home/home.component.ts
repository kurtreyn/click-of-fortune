import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription, take, Subject } from 'rxjs';

import { ApiService } from '../../../services/api/api.service';
import { PuzzleService } from '../../../services/puzzle/puzzle.service';
import { IPuzzle } from '../../../models/puzzleInterface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, OnChanges {
  devEnv: boolean = false;
  serverReady: boolean = false;
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

  constructor(private apiService: ApiService, private puzzServ: PuzzleService) { }

  ngOnInit() {
    this.getEnv();

    if (this.devEnv) {
      this.serverReady = true;
    }

    if (!this.devEnv) {
      this.wakeUpServer();
    }


    if (this.serverReady) {
      this.fetchAllPuzzles();
    }

  }

  ngOnChanges() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchAllPuzzles() {
    this.subscription = this.apiService.getPuzzles().subscribe(puzzle => {
      this.allPuzzles = puzzle;
      this.allPuzzlesLength = this.allPuzzles.length;
      this.setActivePuzzle(); // Call setActivePuzzle() here
    });
  }

  setActivePuzzle() {
    console.log('this.allPuzzles', this.allPuzzles)
    const randomIndex = Math.floor(Math.random() * this.allPuzzles.length);
    // console.log('randomIndex', randomIndex);
    const randomPuzzle = this.allPuzzles[randomIndex];
    console.log('randomPuzzle', randomPuzzle);
    const alreadyUsed = this.usedPuzzles.find(puzzle => puzzle.id === randomPuzzle.id);
    console.log('alreadyUsed', alreadyUsed);
    if (!alreadyUsed) {
      this.puzzleCategory = randomPuzzle.category;
      this.puzzleValue = randomPuzzle.puzzle;
      this.usedPuzzles.push(randomPuzzle);
    }

    console.log("HOME this.puzzleId: ", this.puzzleId);
    console.log('HOME this.puzzleCategory', this.puzzleCategory)
    console.log('HOME this.puzzleValue: ', this.puzzleValue)
    console.log('HOME this.usedPuzzles: ', this.usedPuzzles)
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



  wakeUpServer() {
    this.apiService.wakeUpServer().pipe(
      take(1)
    ).subscribe((resp) => {
      if (resp === 'server is good to go') {
        this.serverReady = true;
      }
    });
  }

  getEnv() {
    this.devEnv = this.apiService.getEnv();
  }

}
