import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-puzzle-board',
  templateUrl: './puzzle-board.component.html',
  styleUrls: ['./puzzle-board.component.css']
})
export class PuzzleBoardComponent implements OnInit, OnChanges {
  public puzzleLetterArray: string[] = [];
  @Input() puzzleValue!: string;
  @Input() puzzleCategory!: string;
  @Input() guessedLetters!: string[];

  constructor() { }

  ngOnInit(): void {
    if (this.puzzleValue) {
      // console.log('PUZZLE BOARD this.puzzleValue: ', this.puzzleValue);
      this.createPuzzleLetterArray();
    }
  }

  ngOnChanges() {
    if (this.puzzleValue) {
      console.log('PUZZLE BOARD this.puzzleValue: ', this.puzzleValue);
      this.createPuzzleLetterArray();
    }
  }

  private createPuzzleLetterArray() {
    this.puzzleLetterArray = this.puzzleValue.split('');
  }

}
