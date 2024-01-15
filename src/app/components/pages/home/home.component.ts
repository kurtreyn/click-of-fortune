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
  public serverReady: boolean = false;
  public puzzles: IPuzzle[] = [];
  subscription!: Subscription;
  public puzzleValue: string = 'This is a test puzzle';
  public guessedLetters: string[] = [];

  constructor(private service: ApiService) { }

  ngOnInit() {

    this.getAllPuzzles();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAllPuzzles() {
    this.subscription = this.service.getPuzzles().subscribe(puzzle => {
      this.puzzles = puzzle;
      console.log('all puzzles', this.puzzles);
    });
  }

  wakeUpServer() {
    if (this.service.getLocalEnv()) {
      this.service.wakeUpServer().pipe(
        take(1)
      ).subscribe((resp) => {
        if (resp === 'server is good to go') {
          this.serverReady = true;
        }
      });
    }
  }

}
