import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-puzzle-board',
  templateUrl: './puzzle-board.component.html',
  styleUrls: ['./puzzle-board.component.css']
})
export class PuzzleBoardComponent implements OnInit {
  public puzzleLetterArray: string[] = [];
  @Input() puzzleValue!: string;
  @Input() guessedLetters!: string[];

  constructor() { }

  ngOnInit(): void {
    if (this.puzzleValue) {
      this.createPuzzleLetterArray();
    }
  }

  private createPuzzleLetterArray() {
    this.puzzleLetterArray = this.puzzleValue.split('');
  }

}
