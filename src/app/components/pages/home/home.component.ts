import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, take } from 'rxjs';

import { ApiService } from '../../../services/api/api.service';
import { IPuzzle } from '../../../models/puzzleInterface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  devEnv: boolean = false;
  public serverReady: boolean = false;
  public puzzles: IPuzzle[] = [];
  subscription!: Subscription;
  public puzzleValue: string = 'This is a test puzzle';
  public guessedLetters: string[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getEnv();

    if (this.devEnv) {
      this.serverReady = true;
    }

    if (!this.devEnv) {
      this.wakeUpServer();
    }


    if (this.serverReady) {
      this.getAllPuzzles();
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAllPuzzles() {
    this.subscription = this.apiService.getPuzzles().subscribe(puzzle => {
      this.puzzles = puzzle;
      console.log('all puzzles', this.puzzles);
    });
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
