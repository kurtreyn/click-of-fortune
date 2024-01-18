import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { IPuzzle } from '../../../models/IPuzzle';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-puzzle',
  templateUrl: './create-puzzle.component.html',
  styleUrls: ['./create-puzzle.component.css']
})
export class CreatePuzzleComponent implements OnInit {
  devEnv: boolean = false;
  category!: string;
  puzzle!: string;
  id = uuidv4();
  newPuzzle: IPuzzle[] = [];
  subscription!: Subscription;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  puzzleForm!: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.puzzleForm = this.formBuilder.group({
      category: new FormControl('', [Validators.required]),
      puzzle: new FormControl('', [Validators.required])
    });
  }

  public resetForm() {
    this.puzzleForm.reset();
  }

  handleSubmit() {
    let puzzle;

    if (this.devEnv) {
      puzzle = {
        id: this.id,
        category: this.puzzleForm.value.category,
        puzzle: this.puzzleForm.value.puzzle,
      }
    } else {
      puzzle = {
        category: this.puzzleForm.value.category,
        puzzle: this.puzzleForm.value.puzzle,
      }
    }
    console.log('puzzle', puzzle);

    // this.subscription = this.apiService.addPuzzle(puzzle).subscribe(puzzle => {
    //   this.newPuzzle.push(puzzle);
    // })
    this.puzzleForm.reset();
  }

}
