import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public puzzleValue: string = 'This is a test puzzle';
  public guessedLetters: string[] = [];

  constructor() { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

}
