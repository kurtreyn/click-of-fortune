import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ApiService } from '../../../services/api/api.service';
import { IPuzzle } from '../../../models/puzzleInterface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public puzzles: IPuzzle[] = [];
  subscription!: Subscription;
  public puzzleValue: string = 'This is a test puzzle';
  public guessedLetters: string[] = [];

  constructor(private service: ApiService) { }

  ngOnInit() {
    this.updateInfo();
    console.log('all puzzles', this.puzzles);
  }

  updateInfo() {
    this.subscription = this.service.getPuzzles().subscribe(puzzle => {
      this.puzzles = puzzle;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
