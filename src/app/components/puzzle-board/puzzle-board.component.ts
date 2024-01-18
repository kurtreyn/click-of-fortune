import { Component, OnInit, OnChanges } from '@angular/core';
import { Subscription, take, Subject, takeUntil } from 'rxjs';
import { PuzzleService } from 'src/app/services/puzzle/puzzle.service';
import { IGame } from 'src/app/models/IGame';


@Component({
  selector: 'app-puzzle-board',
  templateUrl: './puzzle-board.component.html',
  styleUrls: ['./puzzle-board.component.css']
})
export class PuzzleBoardComponent implements OnInit, OnChanges {
  subscription!: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();
  gameDetails: IGame = {} as IGame;

  constructor(private puzzleService: PuzzleService) { }

  ngOnInit(): void {
    this.loadGameDetails();
    // this.puzzleService.gameDetails$.pipe(
    //   take(1)
    // ).subscribe(details => {
    //   const letter = details.inputValues?.letter;
    //   if (letter) {
    //     this.checkForMatch(letter);
    //   }
    // });
  }

  ngOnChanges() {
  }

  loadGameDetails() {
    this.puzzleService.gameDetails$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(details => {
      this.gameDetails = details;
      console.log("PUZZLE BOARD: ", this.gameDetails);
    });
    this.createPuzzleLetterArray();

  }

  setGameDetails(details: IGame) {
    this.gameDetails = details;
    this.puzzleService.setGameDetails(this.gameDetails);
  }


  createPuzzleLetterArray() {
    if (this.gameDetails && this.gameDetails.answerKey && this.gameDetails.answerKey.length > 0) {
      const emptyArray: string[] = [];
      for (let i = 0; i < this.gameDetails.answerKey.length; i++) {
        if (this.gameDetails.answerKey[i] !== ' ') {
          emptyArray.push('_');
        } else {
          emptyArray.push('  ');
        }
      }
      this.setGameDetails({
        ...this.gameDetails,
        emptyPuzzleLetterArray: emptyArray,
      });
    }
    // console.log('this.gameDetails: ', this.gameDetails);
  }

  checkForMatch(letter: string) {
    console.log('CHECK MATCH letter: ', letter)
    if (this.gameDetails && this.gameDetails.answerKey && this.gameDetails.answerKey.length > 0) {
      console.log('checking for letter: ', letter);
      if (this.gameDetails.answerKey.includes(letter)) {
        console.log('letter found!');
        this.updateEmptyPuzzleLetterArray(letter);
      }
    }
  }

  updateEmptyPuzzleLetterArray(letter: string) {
    console.log('UPDATE EMPTY PUZZLE LETTER ARRAY letter: ', letter);
    if (this.gameDetails && this.gameDetails.answerKey && this.gameDetails.answerKey.length > 0) {
      let answArr = this.gameDetails.answerKey;
      let emptyArr = this.gameDetails.emptyPuzzleLetterArray || [];
      console.log('answArr: ', answArr);
      console.log('emptyArr: ', emptyArr);

      for (let i = 0; i < answArr.length; i++) {
        if (answArr[i] === letter) {
          emptyArr[i] = letter;
        }
      }

      this.setGameDetails({
        ...this.gameDetails,
        emptyPuzzleLetterArray: emptyArr,
      });
    }
    console.log('UPDATE EMPTY PUZZLE LETTERS gameDetails: ', this.gameDetails.emptyPuzzleLetterArray);
  }
}
