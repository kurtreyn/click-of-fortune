import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IPuzzle } from '../../models/puzzleInterface';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = 'http://localhost:3000/puzzles';
  // url: string = `https://spinoffortuneserver.onrender.com/`
  wakeup: string = 'wakeup';
  add_puzzle: string = 'add-puzzle';
  get_puzzles: string = 'get-puzzles';
  puzzlesEndpoint: string = 'puzzles';
  devEnv: boolean = true;
  private puzzleSubject = new BehaviorSubject<IPuzzle[]>([]);



  constructor(private http: HttpClient) {
    // Fetch the data from the database on initialization
    this.fetchPuzzles();
  }

  fetchPuzzles() {
    this.http.get<IPuzzle[]>(this.devEnv ? this.url : this.url + this.get_puzzles).subscribe(puzzle => {
      this.puzzleSubject.next(puzzle);
    })
  }

  getPuzzles() {
    // Return the subject as an Observable
    return this.puzzleSubject.asObservable();
  }

  addPuzzle(puzzle: IPuzzle): Observable<IPuzzle> {
    return this.http.post<IPuzzle>(this.devEnv ? this.url : this.url + this.get_puzzles, puzzle, httpOptions)
      .pipe(
        tap(() => {
          this.fetchPuzzles();
        })
      )
  }

  wakeUpServer() {
    return this.http.get(this.url + this.wakeup);
  }

  getEnv() {
    return this.devEnv;
  }
}
