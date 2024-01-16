import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { PuzzleService } from '../../services/puzzle/puzzle.service';
import { IPuzzle } from '../../models/puzzleInterface'

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {
  letter: string = '';
  solvePuzzle: string = '';
  newPuzzle: IPuzzle[] = [];
  subscription!: Subscription;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private puzzleService: PuzzleService) { }

  inputForm!: FormGroup;

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.inputForm = this.formBuilder.group({
      letter: new FormControl('', [Validators.required]),
      solvePuzzle: new FormControl('')
    });
  }

  handleSubmit() {
    this.letter = this.inputForm.value.letter;
    this.solvePuzzle = this.inputForm.value.solvePuzzle;
    this.puzzleService.setInputFormValues({ letter: this.letter, solvePuzzle: this.solvePuzzle });

    this.inputForm.reset();
  }

}
