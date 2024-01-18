import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IPuzzle } from '../../models/IPuzzle';
import { puzzleData } from '../../../data/puzzleData';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
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
