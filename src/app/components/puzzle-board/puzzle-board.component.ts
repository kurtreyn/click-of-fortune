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
  }

  ngOnChanges() {
  }

  loadGameDetails() {
    this.puzzleService.gameDetails$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(details => {
      this.gameDetails = details;
      console.log("GAME DETAILS: ", this.gameDetails)
    });
    this.createMaksedPuzzleArr();
  }

  setGameDetails(details: IGame) {
    this.gameDetails = details;
    this.puzzleService.setGameDetails(this.gameDetails);
  }


  createMaksedPuzzleArr() {
    if (this.gameDetails && this.gameDetails.puzzleValue && this.gameDetails.puzzleValue.length > 0) {
      const emptyArr = this.puzzleService.createMaksedPuzzleArr(this.gameDetails.puzzleValue);
      this.setGameDetails({
        ...this.gameDetails,
        maskedPuzzleArr: emptyArr,
      });
    }
  }
}
