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
  url: string = 'https://spinoffortuneserver.onrender.com/'
  wakeupUrl: string = 'https://spinoffortuneserver.onrender.com/wakeup';
  addPuzzleUrl: string = 'https://spinoffortuneserver.onrender.com/add-puzzle';
  getPuzzlesUrl: string = 'https://spinoffortuneserver.onrender.com/get-puzzles';
  private puzzleSubject = new BehaviorSubject<IPuzzle[]>([]);



  constructor(private http: HttpClient) {
    // Fetch the info from the database on initialization
    this.fetchPuzzles();
  }

  fetchPuzzles() {
    this.http.get<IPuzzle[]>(this.getPuzzlesUrl).subscribe(puzzle => {
      this.puzzleSubject.next(puzzle);
    })
  }

  getPuzzles() {
    // Return the subject as an Observable
    return this.puzzleSubject.asObservable();
  }

  addPuzzle(puzzle: IPuzzle): Observable<IPuzzle> {
    return this.http.post<IPuzzle>(this.addPuzzleUrl, puzzle, httpOptions)
      .pipe(
        tap(() => {
          this.fetchPuzzles();
        })
      )
  }

  wakeUpServer() {
    return this.http.get(this.wakeupUrl);
  }
}
