import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IPuzzle } from '../../models/puzzleInterface';
import { puzzleData } from '../../../data/puzzleData';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = 'http://localhost:3000/puzzles';
  // url: string = `https://spinoffortuneserver.onrender.com/`
  wakeup: string = 'wakeup';
  puzzlesEndpoint: string = 'puzzles';
  devEnv: boolean = true;
  private puzzleSubject = new BehaviorSubject<IPuzzle[]>([]);



  constructor() {
    this.loadPuzzles();
  }

  loadPuzzles() {
    this.puzzleSubject.next(puzzleData);
  }


  getPuzzles() {
    // Return the subject as an Observable
    return this.puzzleSubject.asObservable();
  }




}
