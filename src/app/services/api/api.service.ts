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
  // url: string = 'http://localhost:3000/puzzles';
  url: string = `https://spinoffortuneserver.onrender.com/`
  wakeup: string = 'wakeup';
  puzzlesEndpoint: string = 'puzzles';
  devEnv: boolean = false;
  private puzzleSubject = new BehaviorSubject<IPuzzle[]>([]);



  constructor(private http: HttpClient) {
    // Fetch the data from the database on initialization
    this.fetchPuzzles();
  }

  fetchPuzzles() {
    this.http.get<IPuzzle[]>(this.devEnv ? this.url : this.url + this.puzzlesEndpoint).subscribe(puzzle => {
      this.puzzleSubject.next(puzzle);
    })
  }

  getPuzzles() {
    // Return the subject as an Observable
    return this.puzzleSubject.asObservable();
  }

  addPuzzle(puzzle: IPuzzle): Observable<IPuzzle> {
    return this.http.post<IPuzzle>(this.devEnv ? this.url : this.url + this.puzzlesEndpoint, puzzle, httpOptions)
      .pipe(
        tap(() => {
          this.fetchPuzzles();
        })
      )
  }

  wakeUpServer() {
    let response = this.http.get(this.url + this.wakeup);
    console.log('wakeUpServer response: ', response);
    return response;
  }

  getEnv() {
    return this.devEnv;
  }
}
