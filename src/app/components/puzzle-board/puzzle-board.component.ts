import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle/puzzle.service';

@Component({
  selector: 'app-puzzle-board',
  templateUrl: './puzzle-board.component.html',
  styleUrls: ['./puzzle-board.component.css']
})
export class PuzzleBoardComponent implements OnInit, OnChanges {
  puzzleLetterArray: string[] = [];
  emptyPuzzleLetterArray: string[] = [];
  puzzleLetterArrayLength: number = 0;
  isEmpty: boolean = false;
  @Input() puzzleValue!: string;
  @Input() puzzleCategory!: string;
  @Input() guessedLetters!: string[];

  constructor(private puzzleService: PuzzleService) { }

  ngOnInit(): void {
    if (this.puzzleValue) {
      this.createPuzzleLetterArray();
      this.setEmptyPuzzleLetterArray();
    }
    this.puzzleService.inputFormValues$.subscribe(values => {
      this.checkForMatch(values.letter);
    });
  }

  ngOnChanges() {
    if (this.puzzleValue) {
      this.createPuzzleLetterArray();
      this.setEmptyPuzzleLetterArray();
    }
    console.log('guessedLetters: ', this.guessedLetters)
  }

  private createPuzzleLetterArray() {
    this.puzzleLetterArray = this.puzzleValue.split('');
  }

  setEmptyPuzzleLetterArray() {
    this.emptyPuzzleLetterArray = [];
    this.puzzleLetterArrayLength = this.puzzleLetterArray.length;
    for (let i = 0; i < this.puzzleLetterArrayLength; i++) {
      if (this.puzzleLetterArray[i] !== ' ') {
        this.emptyPuzzleLetterArray.push('_');
      } else {
        this.emptyPuzzleLetterArray.push('  ');
      }
    }

    console.log('this.emptyPuzzleLetterArray: ', this.emptyPuzzleLetterArray);
  }

  checkForMatch(letter: string) {
    console.log('checking for letter: ', letter);
    if (this.puzzleLetterArray.includes(letter)) {
      console.log('letter found!');
      this.updateEmptyPuzzleLetterArray(letter);
    }
  }

  updateEmptyPuzzleLetterArray(letter: string) {
    for (let i = 0; i < this.puzzleLetterArrayLength; i++) {
      if (this.puzzleLetterArray[i] === letter) {
        this.emptyPuzzleLetterArray[i] = letter;
      }
    }
  }

}
