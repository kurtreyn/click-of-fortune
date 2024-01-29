import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';

import { IPuzzle } from '../../models/IPuzzle';
import { puzzleData } from '../../../data/puzzleData';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private puzzleSubject = new BehaviorSubject<IPuzzle[]>([]);
  private puzzleData = new BehaviorSubject<IPuzzle[]>([]);
  url: string = 'http://localhost:5000/puzzles'; // restAPI_Java_Spring_Boot_Postgres



  constructor(private http: HttpClient) {
    this.loadPuzzles();
    this.fetchPuzzles();
  }

  get puzzleData$() {
    return this.puzzleData.asObservable();
  }

  fetchPuzzles() {
    this.http.get<IPuzzle[]>(this.url).subscribe(puzzles => {
      this.puzzleData.next(puzzles);
    })
  }

  getFetchedPuzzles() {
    return this.puzzleData.asObservable();
  }



  loadPuzzles() {
    this.puzzleSubject.next(puzzleData);
  }


  getPuzzles() {
    // Return the subject as an Observable
    return this.puzzleSubject.asObservable();
  }




}
