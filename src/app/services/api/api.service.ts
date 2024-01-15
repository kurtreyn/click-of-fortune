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
  private puzzleSubject = new BehaviorSubject<IPuzzle[]>([]);



  constructor(private http: HttpClient) {
    // Fetch the info from the database on initialization
    this.fetchPuzzles();
  }

  fetchPuzzles() {
    this.http.get<IPuzzle[]>(this.url).subscribe(info => {
      this.puzzleSubject.next(info);
    })
  }

  getPuzzles() {
    // Return the subject as an Observable
    return this.puzzleSubject.asObservable();
  }

  addPuzzle(puzzle: IPuzzle): Observable<IPuzzle> {
    return this.http.post<IPuzzle>(this.url, puzzle, httpOptions)
      .pipe(
        tap(() => {
          this.fetchPuzzles();
        })
      )
  }
}
